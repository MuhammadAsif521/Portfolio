import { inject, Injectable, OnDestroy } from "@angular/core";
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
  enableNetwork,
  disableNetwork,
  limit
} from "@angular/fire/firestore";
import { Observable, of, BehaviorSubject, from } from "rxjs";
import { map, catchError, shareReplay, take } from "rxjs/operators";
import { Projects, Message } from "src/app/core/interfaces/core.interface";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnDestroy {
  private firestore = inject(Firestore);

  // ---------------------------
  // Projects caching
  // ---------------------------
  private projects$?: Observable<Projects[]>;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private projectsPageSize = 20;
  private cacheTimestamp = new Map<string, number>();

  // Loading states
  private loadingSubjects = new Map<string, BehaviorSubject<boolean>>();

  // ---------------------------
  // Projects
  // ---------------------------
  getProjects(refresh = false): Observable<Projects[]> {
    if (refresh || !this.isCacheValid('projects') || !this.projects$) {
      this.setLoading('projects', true);

      const projectsRef = collection(this.firestore, 'projects') as CollectionReference<Projects>;
      const q = collectionData(
        collection(this.firestore, 'projects'), 
        { idField: 'id' }
      );

      this.projects$ = collectionData<Projects>(
        collection(this.firestore, 'projects') as CollectionReference<Projects>,
        { idField: 'id' }
      ).pipe(
        take(1),
        map(projects => {
          this.setLoading('projects', false);
          this.setCacheTimestamp('projects');
          return projects;
        }),
        catchError(err => {
          console.error('Error loading projects:', err);
          this.setLoading('projects', false);
          return of([]);
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.projects$;
  }

  getProject(id: string): Observable<Projects | undefined> {
    const projectsRef = collection(this.firestore, 'projects') as CollectionReference<Projects>;
    const projectDoc = doc(projectsRef, id);
    return docData<Projects>(projectDoc, { idField: 'id' }).pipe(
      take(1),
      catchError(() => of(undefined))
    );
  }

  // ---------------------------
  // Messages
  // ---------------------------
  addMessage(message: Omit<Message, 'id' | 'timestamp' | 'read'>): Observable<void> {
    const messageData: WithFieldValue<DocumentData> = {
      ...message,
      timestamp: new Date(),
      read: false
    };
    return from(addDoc(collection(this.firestore, 'messages'), messageData)).pipe(
      map(() => {
        // Invalidate messages cache if you add caching later
      })
    );
  }

  // ---------------------------
  // Firestore Network
  // ---------------------------
  goOffline(): Observable<void> {
    return from(disableNetwork(this.firestore));
  }

  goOnline(): Observable<void> {
    return from(enableNetwork(this.firestore));
  }

  // ---------------------------
  // Loading state helpers
  // ---------------------------
  getLoadingState(key: string): Observable<boolean> {
    if (!this.loadingSubjects.has(key)) {
      this.loadingSubjects.set(key, new BehaviorSubject<boolean>(false));
    }
    return this.loadingSubjects.get(key)!.asObservable();
  }

  private setLoading(key: string, loading: boolean) {
    if (!this.loadingSubjects.has(key)) {
      this.loadingSubjects.set(key, new BehaviorSubject(loading));
    } else {
      this.loadingSubjects.get(key)!.next(loading);
    }
  }

  // ---------------------------
  // Cache helpers
  // ---------------------------
  private setCacheTimestamp(key: string) {
    this.cacheTimestamp.set(key, Date.now());
  }

  private isCacheValid(key: string) {
    const timestamp = this.cacheTimestamp.get(key);
    return timestamp ? (Date.now() - timestamp < this.CACHE_TTL) : false;
  }

  private invalidateCache(keys: string | string[]) {
    (Array.isArray(keys) ? keys : [keys]).forEach(key => {
      this.cacheTimestamp.delete(key);
      if (key === 'projects') this.projects$ = undefined;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubjects.clear();
    this.cacheTimestamp.clear();
    this.projects$ = undefined;
  }
}
