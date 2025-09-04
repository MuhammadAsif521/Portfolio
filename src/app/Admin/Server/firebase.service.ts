import { inject, Injectable, OnDestroy } from "@angular/core";
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  signOut,
  authState,
  browserLocalPersistence,
  setPersistence
} from "@angular/fire/auth";
import {
  Firestore,
  collection,
  CollectionReference,
  doc,
  docData,
  orderBy,
  collectionData,
  WithFieldValue,
  DocumentData,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  enableNetwork,
  disableNetwork
} from "@angular/fire/firestore";
import { Observable, from, map, switchMap, of, forkJoin, shareReplay, take, BehaviorSubject, combineLatest, timer, startWith, catchError, EMPTY } from "rxjs";
import { AdminUser, Projects, Message } from "src/app/core/interfaces/core.interface";
import { ref, uploadBytes, getDownloadURL, Storage, deleteObject } from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnDestroy {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private storage = inject(Storage);

  // Enhanced caching with TTL and pagination
  private authState$ = authState(this.auth).pipe(shareReplay({ bufferSize: 1, refCount: false }));
  private currentUser$?: Observable<AdminUser | null>;
  private projects$?: Observable<Projects[]>;
  private messages$?: Observable<Message[]>;
  private unreadCount$?: Observable<number>;
  
  // Cache invalidation and pagination
  private cacheTimestamp = new Map<string, number>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private projectsPageSize = 20;
  private messagesPageSize = 50;
  private lastProjectDoc?: QueryDocumentSnapshot<Projects>;
  private lastMessageDoc?: QueryDocumentSnapshot<Message>;
  
  // Loading states
  private loadingSubjects = new Map<string, BehaviorSubject<boolean>>();

  // ---------------------------
  // Authentication with Enhanced Error Handling
  // ---------------------------

  login(email: string, password: string): Observable<User> {
    this.setLoading('auth', true);
    return from(
      setPersistence(this.auth, browserLocalPersistence).then(() =>
        signInWithEmailAndPassword(this.auth, email, password)
      )
    ).pipe(
      map(result => {
        this.setLoading('auth', false);
        return result.user;
      }),
      catchError(error => {
        this.setLoading('auth', false);
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.clearAllCaches();
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(map(user => !!user));
  }

  getCurrentUser(): Observable<AdminUser | null> {
    if (!this.isCacheValid('currentUser') || !this.currentUser$) {
      this.currentUser$ = this.authState$.pipe(
        switchMap(user => {
          if (!user) return of(null);
          const adminRef = collection(this.firestore, 'admins') as CollectionReference<AdminUser>;
          const adminDoc = doc(adminRef, user.uid);
          return docData<AdminUser>(adminDoc).pipe(
            take(1),
            map(adminUser => {
              this.setCacheTimestamp('currentUser');
              return adminUser ?? null;
            }),
            catchError(() => of(null))
          );
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.currentUser$;
  }

  // ---------------------------
  // Projects CRUD with Pagination & Optimistic Updates
  // ---------------------------

  getProjects(refresh = false): Observable<Projects[]> {
    if (refresh || !this.isCacheValid('projects') || !this.projects$) {
      this.setLoading('projects', true);
      const projectsRef = collection(this.firestore, 'projects') as CollectionReference<Projects>;
      const q = query(
        projectsRef, 
        orderBy('createdAt', 'desc'), 
        limit(this.projectsPageSize)
      );

      this.projects$ = collectionData<Projects>(q, { idField: 'id' }).pipe(
        map(projects => {
          this.setLoading('projects', false);
          this.setCacheTimestamp('projects');
          return projects;
        }),
        catchError(error => {
          this.setLoading('projects', false);
          console.error('Error loading projects:', error);
          return of([]);
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.projects$;
  }

  // Pagination support
  loadMoreProjects(): Observable<Projects[]> {
    if (!this.lastProjectDoc) return of([]);
    
    const projectsRef = collection(this.firestore, 'projects') as CollectionReference<Projects>;
    const q = query(
      projectsRef,
      orderBy('createdAt', 'desc'),
      startAfter(this.lastProjectDoc),
      limit(this.projectsPageSize)
    );

    return collectionData<Projects>(q, { idField: 'id' }).pipe(
      take(1),
      catchError(() => of([]))
    );
  }

  getProject(id: string): Observable<Projects | undefined> {
    const projectsRef = collection(this.firestore, 'projects') as CollectionReference<Projects>;
    const projectDoc = doc(projectsRef, id);
    return docData<Projects>(projectDoc, { idField: 'id' }).pipe(
      take(1),
      catchError(() => of(undefined))
    );
  }

  // Batch upload with progress tracking
  uploadImages(files: File[], onProgress?: (progress: number) => void): Observable<string[]> {
    if (files.length === 0) return of([]);
    
    let completedUploads = 0;
    const uploadObservables = files.map(file => {
      const filePath = `projects/${new Date().getTime()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      return from(uploadBytes(storageRef, file)).pipe(
        switchMap(() => {
          completedUploads++;
          if (onProgress) {
            onProgress((completedUploads / files.length) * 100);
          }
          return from(getDownloadURL(storageRef));
        }),
        catchError(error => {
          console.error('Upload failed:', error);
          return of('');
        })
      );
    });
    
    return forkJoin(uploadObservables).pipe(
      map(urls => urls.filter(url => url !== ''))
    );
  }

  // Optimistic updates
  addProject(project: Omit<Projects, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const projectData: WithFieldValue<DocumentData> = {
      ...project,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const projectsRef = collection(this.firestore, 'projects');
    return from(addDoc(projectsRef, projectData)).pipe(
      map(docRef => {
        this.invalidateCache('projects');
        return docRef.id;
      }),
      catchError(error => {
        console.error('Error adding project:', error);
        throw error;
      })
    );
  }

  updateProject(id: string, project: Partial<Projects>): Observable<void> {
    const projectDoc = doc(this.firestore, `projects/${id}`);
    const updateData = { ...project, updatedAt: new Date() };
    
    return from(updateDoc(projectDoc, updateData)).pipe(
      map(() => {
        this.invalidateCache('projects');
      }),
      catchError(error => {
        console.error('Error updating project:', error);
        throw error;
      })
    );
  }
 deleteImages(imageUrls: string[]): Observable<void> {
    if (imageUrls.length === 0) return of();

    const deleteObservables = imageUrls.map(url => {
      try {
        const storageRef = ref(this.storage, url);
        return from(deleteObject(storageRef)).pipe(
          catchError(error => {
            console.warn('Failed to delete image:', url, error);
            return of(null); // Continue even if some deletions fail
          })
        );
      } catch (error) {
        console.warn('Invalid image URL for deletion:', url, error);
        return of(null);
      }
    });

    return forkJoin(deleteObservables).pipe(
      map(() => undefined),
      catchError(error => {
        console.error('Error during batch image deletion:', error);
        return of(undefined); // Don't fail the whole operation
      })
    );
  }
  deleteProject(id: string): Observable<void> {
    const projectDoc = doc(this.firestore, `projects/${id}`);
    return from(deleteDoc(projectDoc)).pipe(
      map(() => {
        this.invalidateCache('projects');
      }),
      catchError(error => {
        console.error('Error deleting project:', error);
        throw error;
      })
    );
  }

  // ---------------------------
  // Messages with Smart Polling & Batch Operations
  // ---------------------------

  getMessages(refresh = false): Observable<Message[]> {
    if (refresh || !this.isCacheValid('messages') || !this.messages$) {
      this.setLoading('messages', true);
      const messagesRef = collection(this.firestore, 'messages') as CollectionReference<Message>;
      const q = query(
        messagesRef, 
        orderBy('timestamp', 'desc'),
        limit(this.messagesPageSize)
      );

      this.messages$ = collectionData<Message>(q, { idField: 'id' }).pipe(
        map(messages => {
          this.setLoading('messages', false);
          this.setCacheTimestamp('messages');
          return messages;
        }),
        catchError(error => {
          this.setLoading('messages', false);
          console.error('Error loading messages:', error);
          return of([]);
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.messages$;
  }

  // Smart unread count with debounced updates
  getUnreadMessagesCount(): Observable<number> {
    if (!this.isCacheValid('unreadCount') || !this.unreadCount$) {
      const messagesRef = collection(this.firestore, 'messages') as CollectionReference<Message>;
      const q = query(messagesRef, where('read', '==', false));

      this.unreadCount$ = timer(0, 30000).pipe( // Poll every 30 seconds
        startWith(0),
        switchMap(() => collectionData<Message>(q)),
        map(messages => {
          this.setCacheTimestamp('unreadCount');
          return messages.length;
        }),
        catchError(() => of(0)),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.unreadCount$;
  }

  // Batch mark as read
  markMessagesAsRead(messageIds: string[]): Observable<void> {
    if (messageIds.length === 0) return of();
    
    const updatePromises = messageIds.map(id => {
      const messageDoc = doc(this.firestore, `messages/${id}`);
      return updateDoc(messageDoc, { read: true });
    });

    return from(Promise.all(updatePromises)).pipe(
      map(() => {
        this.invalidateCache(['messages', 'unreadCount']);
      }),
      catchError(error => {
        console.error('Error marking messages as read:', error);
        throw error;
      })
    );
  }

  addMessage(message: Omit<Message, 'id' | 'timestamp' | 'read'>): Observable<void> {
    const messageData: WithFieldValue<DocumentData> = {
      ...message,
      timestamp: new Date(),
      read: false
    };
    const messagesRef = collection(this.firestore, 'messages');
    return from(addDoc(messagesRef, messageData)).pipe(
      map(() => {
        this.messages$ = undefined;   // reset cache
        this.unreadCount$ = undefined;
      })
    );
  }
  deleteMessage(id: string): Observable<void> {
    const messageDoc = doc(this.firestore, `messages/${id}`);
    return from(deleteDoc(messageDoc)).pipe(
      map(() => {
        this.messages$ = undefined;   // reset cache
        this.unreadCount$ = undefined;
      })
    );
  }
  // ---------------------------
  // Performance & Utility Methods
  // ---------------------------

  // Network status management
  goOffline(): Observable<void> {
    return from(disableNetwork(this.firestore));
  }

  goOnline(): Observable<void> {
    return from(enableNetwork(this.firestore));
  }

  // Loading states
  getLoadingState(key: string): Observable<boolean> {
    if (!this.loadingSubjects.has(key)) {
      this.loadingSubjects.set(key, new BehaviorSubject<boolean>(false));
    }
    return this.loadingSubjects.get(key)!.asObservable();
  }

  private setLoading(key: string, loading: boolean): void {
    if (!this.loadingSubjects.has(key)) {
      this.loadingSubjects.set(key, new BehaviorSubject<boolean>(loading));
    } else {
      this.loadingSubjects.get(key)!.next(loading);
    }
  }

  // Cache management
  private setCacheTimestamp(key: string): void {
    this.cacheTimestamp.set(key, Date.now());
  }

  private isCacheValid(key: string): boolean {
    const timestamp = this.cacheTimestamp.get(key);
    if (!timestamp) return false;
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  private invalidateCache(keys: string | string[]): void {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    keysArray.forEach(key => {
      this.cacheTimestamp.delete(key);
      if (key === 'projects') this.projects$ = undefined;
      if (key === 'messages') this.messages$ = undefined;
      if (key === 'unreadCount') this.unreadCount$ = undefined;
      if (key === 'currentUser') this.currentUser$ = undefined;
    });
  }

  private clearAllCaches(): void {
    this.cacheTimestamp.clear();
    this.currentUser$ = undefined;
    this.projects$ = undefined;
    this.messages$ = undefined;
    this.unreadCount$ = undefined;
  }

  ngOnDestroy(): void {
    this.clearAllCaches();
    this.loadingSubjects.clear();
  }
}