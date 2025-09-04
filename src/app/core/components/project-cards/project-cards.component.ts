import { Component, input, InputSignal, OnInit, OnDestroy, inject, computed, signal } from '@angular/core';
import { Subject, takeUntil, startWith } from 'rxjs';
import { FirebaseService } from 'src/app/Admin/Server/firebase.service';
import { Projects } from '../../interfaces/core.interface';
import { UtilityService } from '../../Services/utility.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-project-cards',
  templateUrl: './project-cards.component.html',
  styleUrls: ['./project-cards.component.scss'],
})
export class ProjectCardsComponent implements OnInit, OnDestroy {
  // Injected services
  private firebaseService = inject(FirebaseService);
  public utilSer = inject(UtilityService);
  public router = inject(Router);

  // Inputs
  public activeFilter: InputSignal<string> = input('all');
  public role: InputSignal<'admin' | 'user'> = input<'admin' | 'user'>('user');

  // State
  public projects = signal<Projects[]>([]);
  public loading = signal(false);
  public error = signal<string | null>(null);

  private destroy$ = new Subject<void>();

  // Maps
  public typeMap: Record<string, string> = {
    fullstack: 'Full Stack',
    frontend: 'Frontend',
    mobile: 'Mobile Apps',
  };

  public iconMap: Record<string, string> = {
    fullstack: 'fa-layer-group',
    frontend: 'fa-code',
    mobile: 'fa-mobile-screen',
  };

  // Computed
  public filteredProjects = computed(() => {
    const all = this.projects();
    const filter = this.activeFilter();

    if (filter === 'all') return all;
    const mappedType = this.typeMap[filter];
    return all.filter((p) => p.type === mappedType);
  });

  constructor() {}

  ngOnInit() {
    this.setupLoadingState();
    this.loadProjects();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupLoadingState(): void {
    this.firebaseService
      .getLoadingState('projects')
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => this.loading.set(loading));
  }

  private loadProjects(refresh = false): void {
    this.error.set(null);

    this.firebaseService
      .getProjects(refresh)
      .pipe(startWith([]), takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => this.projects.set(projects),
        error: () => {
          this.error.set('Failed to load projects. Please try again later.');
        },
      });
  }

  // Actions
  onEditProject(project: Projects): void {
    if (project.id) {
      this.utilSer.navigateTo(`/admin/edit-project/${project.id}`);
    }
  }

  onDeleteProject(project: Projects): void {
    if (!project.id) return;
    if (!confirm(`Delete "${project.title}"?`)) return;

    const current = this.projects();
    this.projects.set(current.filter((p) => p.id !== project.id));

    this.firebaseService
      .deleteProject(project.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          this.projects.set(current);
          this.error.set('Failed to delete project. Please try again.');
        },
      });
  }

  refreshProjects(): void {
    this.loadProjects(true);
  }

  // Utilities
  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      Completed: '#10b981',
      'In-Progress': '#f59e0b',
      Planned: '#6366f1',
    };
    return statusColors[status];
  }

  trackByProjectId(index: number, project: Projects): string {
    return project.id || index.toString();
  }

  // Getters for template
  get isLoading(): boolean {
    return this.loading();
  }

  get hasError(): boolean {
    return !!this.error();
  }

  get errorMessage(): string | null {
    return this.error();
  }

  get hasProjects(): boolean {
    return this.projects().length > 0;
  }

  get hasFilteredProjects(): boolean {
    return this.filteredProjects().length > 0;
  }

  get isAdmin(): boolean {
    return this.role() === 'admin';
  }
}
