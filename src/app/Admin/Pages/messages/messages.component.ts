import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../../Server/firebase.service';
import { FormsModule } from '@angular/forms';
import { Message } from 'src/app/core/interfaces/core.interface';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ErrorHandlerService, ToastService } from '../../Server/toast.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [FormsModule]
})
export class MessagesComponent implements OnInit, OnDestroy {
  private firebaseService = inject(FirebaseService);
  private destroy$ = new Subject<void>();
  private toastSer = inject(ToastService);
  private errorToast = inject(ErrorHandlerService);

  messages: Message[] = [];
  selectedMessage: Message | null = null;
  selectedMessageIds: Set<string> = new Set();

  isModalOpen = false;
  isLoading = false;
  error: string | null = null;

  filterStatus: 'all' | 'unread' | 'read' = 'all';
  searchTerm = '';
  private searchSubject = new Subject<string>();

  unreadCount = 0;
  totalCount = 0;

  ngOnInit(): void {
    this.setupLoadingState();
    this.setupSearch();
    this.loadMessages();
    this.loadUnreadCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupLoadingState(): void {
    this.firebaseService.getLoadingState('messages')
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);
  }

  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => this.searchTerm = term);
  }

  private loadMessages(refresh = false): void {
    this.error = null;
    this.firebaseService.getMessages(refresh)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (messages) => {
          this.messages = messages.map(m => ({
            ...m,
            timestamp: (m.timestamp as any)?.toDate?.() ?? m.timestamp
          }));
          this.totalCount = this.messages.length;
        },
        error: (err) => this.errorToast.handleError(err)
      });
  }

  private loadUnreadCount(): void {
    this.firebaseService.getUnreadMessagesCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => this.unreadCount = count,
        error: (err) => this.errorToast.handleError(err)
      });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  get filteredMessages(): Message[] {
    let filtered = this.messages;

    if (this.filterStatus === 'unread') {
      filtered = filtered.filter(m => !m.read);
    } else if (this.filterStatus === 'read') {
      filtered = filtered.filter(m => m.read);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.subject.toLowerCase().includes(term) ||
        m.message.toLowerCase().includes(term)
      );
    }
    return filtered;
  }

  openMessage(message: Message): void {
    this.selectedMessage = message;
    this.isModalOpen = true;

    if (!message.read && message.id) {
      this.markAsRead(message.id, false);
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedMessage = null;
  }

  deleteMessage(messageId: string): void {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const originalMessages = [...this.messages];
    this.messages = this.messages.filter(m => m.id !== messageId);
    this.totalCount = this.messages.length;

    this.firebaseService.deleteMessage(messageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.selectedMessage?.id === messageId) {
            this.closeModal();
          }
          this.toastSer.showToast('Message deleted successfully','success');
        },
        error: (err) => {
          this.messages = originalMessages;
          this.totalCount = this.messages.length;
          this.errorToast.handleError(err);
        }
      });
  }

  markAsRead(messageId: string, showFeedback = true): void {
    const message = this.messages.find(m => m.id === messageId);
    if (!message || message.read) return;

    message.read = true;
    this.unreadCount = Math.max(0, this.unreadCount - 1);

    this.firebaseService.markMessagesAsRead([messageId])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (showFeedback) {
            this.toastSer.showToast('Message marked as read','success');
          }
        },
        error: (err) => {
          message.read = false;
          this.unreadCount += 1;
          this.errorToast.handleError(err);
        }
      });
  }

  markAsUnread(messageId: string): void {
    this.toastSer.showToast('Mark as unread not implemented yet','success');
  }

  toggleMessageSelection(messageId: string): void {
    if (this.selectedMessageIds.has(messageId)) {
      this.selectedMessageIds.delete(messageId);
    } else {
      this.selectedMessageIds.add(messageId);
    }
  }

  selectAllMessages(): void {
    const visible = this.filteredMessages;
    if (this.selectedMessageIds.size === visible.length) {
      this.selectedMessageIds.clear();
    } else {
      visible.forEach(m => m.id && this.selectedMessageIds.add(m.id));
    }
  }

  markSelectedAsRead(): void {
    if (this.selectedMessageIds.size === 0) return;

    const ids = Array.from(this.selectedMessageIds);
    ids.forEach(id => {
      const msg = this.messages.find(m => m.id === id);
      if (msg && !msg.read) {
        msg.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    });

    this.firebaseService.markMessagesAsRead(ids)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.selectedMessageIds.clear();
          this.toastSer.showToast('Selected messages marked as read','success');
        },
        error: (err) => {
          ids.forEach(id => {
            const msg = this.messages.find(m => m.id === id);
            if (msg) {
              msg.read = false;
              this.unreadCount += 1;
            }
          });
          this.errorToast.handleError(err);
        }
      });
  }

  deleteSelectedMessages(): void {
    if (this.selectedMessageIds.size === 0) return;

    const count = this.selectedMessageIds.size;
    if (!confirm(`Delete ${count} message${count > 1 ? 's' : ''}?`)) return;

    const ids = Array.from(this.selectedMessageIds);
    const originalMessages = [...this.messages];
    this.messages = this.messages.filter(m => !ids.includes(m.id!));
    this.totalCount = this.messages.length;

    Promise.all(ids.map(id => this.firebaseService.deleteMessage(id).toPromise()))
      .then(() => {
        this.selectedMessageIds.clear();
        this.toastSer.showToast(`${count} message${count > 1 ? 's' : ''} deleted`,'success');
      })
      .catch((err) => {
        this.messages = originalMessages;
        this.totalCount = this.messages.length;
        this.errorToast.handleError(err);
      });
  }

  refreshMessages(): void {
    this.loadMessages(true);
    this.loadUnreadCount();
    this.toastSer.showToast('Messages refreshed','info');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMs = now.getTime() - messageDate.getTime();

    const mins = Math.floor(diffInMs / (1000 * 60));
    const hrs = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(hrs / 24);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days < 7) return `${days}d ago`;
    return this.formatDate(date);
  }

  formatNumber(num: number): string {
    if (num >= 1e12) return (num / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  }
}
