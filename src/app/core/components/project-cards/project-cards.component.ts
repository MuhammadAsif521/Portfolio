import { Component, input, InputSignal, OnInit, OnDestroy, inject, computed, signal } from '@angular/core';
import { Subject, takeUntil, timeout } from 'rxjs';
import { Project } from '../../interfaces/core.interface';
import { UtilityService } from '../../Services/utility.service';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';

@Component({
  standalone: true,
  selector: 'app-project-cards',
  templateUrl: './project-cards.component.html',
  styleUrls: ['./project-cards.component.scss'],
})
export class ProjectCardsComponent implements OnInit, OnDestroy {
  private publicApi = inject(ApiService);
  public utilSer = inject(UtilityService);
  public router = inject(Router);

  public activeFilter: InputSignal<string> = input('all');

  // Signals
  public projects = signal<Project[] | null>(null);
  public loading = signal(true);
  public error = signal<string | null>(null);

  private destroy$ = new Subject<void>();

  // Mappings
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

  public filteredProjects = computed(() => {
    const all = this.projects();
    if (!all) return null;
    const filter = this.activeFilter();
    if (filter === 'all') return all;
    const mappedType = this.typeMap[filter];
    return all.filter((p) => p.type === mappedType);
  });

  ngOnInit() {
    this.loadProjects();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProjects(): void {
    this.error.set(null);
    this.loading.set(true);

    this.publicApi
      .getProjects()
      .pipe(
        timeout(3000),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.projects.set(res.projects || []);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(
            err.name === 'TimeoutError'
              ? 'Request timed out. Please try again later.'
              : 'Failed to load projects. Please try again later.'
          );
          this.loading.set(false);
        },
      });
  }

  refreshProjects(): void {
    this.loadProjects();
  }

  getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      Completed: '#10b981',
      'In-Progress': '#f59e0b',
      Planned: '#6366f1',
    };
    return statusColors[status] || '#999';
  }

  trackByProjectId(index: number, project: Project): string {
    return project._id || index.toString();
  }

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
    const projs = this.projects();
    return !!projs && projs.length > 0;
  }
  get hasFilteredProjects(): boolean {
    const filtered = this.filteredProjects();
    return !!filtered && filtered.length > 0;
  }
}
