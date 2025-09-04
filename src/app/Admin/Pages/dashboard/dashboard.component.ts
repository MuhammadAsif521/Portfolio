import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FirebaseService } from '../../Server/firebase.service';
import { Projects, Message } from 'src/app/core/interfaces/core.interface';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { UtilityService } from 'src/app/core/Services/utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: []
})
export class DashboardComponent implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  public utilSer = inject(UtilityService);
  public projects: Projects[] = [];
  public messages: Message[] = [];
  public unreadMessagesCount = 0;
  public totalProjects = 0;
  public recentMessages: Message[] = [];
  public isLoading = true;
  public error: string | null = null;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    // Load projects
    this.firebaseService.getProjects()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.error = 'Failed to load projects';
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe(projects => {
        this.projects = projects;
        this.totalProjects = projects.length;
        this.isLoading = false;
      });

    // Load messages
    this.firebaseService.getMessages()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {
          this.error = 'Failed to load messages';
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe(messages => {
        this.messages = messages.map(m => ({
          ...m,
          timestamp: (m.timestamp instanceof Date) ? m.timestamp : (m.timestamp as any).toDate()
        }));
        this.recentMessages = this.messages.slice(0, 5);
        this.isLoading = false;
      });

    // Load unread count separately (cached + live updates)
    this.firebaseService.getUnreadMessagesCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => this.unreadMessagesCount = count);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#f59e0b';
      case 'planned':
        return '#6366f1';
      default:
        return '#6b7280';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMs = now.getTime() - messageDate.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }
}
