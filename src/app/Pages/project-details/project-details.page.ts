import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../Admin/Server/firebase.service';
import { UtilityService } from 'src/app/core/Services/utility.service';
import { Projects } from 'src/app/core/interfaces/core.interface';
import { ErrorHandlerService } from 'src/app/Admin/Server/toast.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
})
export class ProjectDetailsPage implements OnInit {
  public utilSer = inject(UtilityService);
  private route = inject(ActivatedRoute);
  private errorSer = inject(ErrorHandlerService);
  private firebaseService = inject(FirebaseService);
  public project: Projects | null = null;
  public isLoading = true;
  public error: string | null = null;

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.firebaseService.getProject(projectId).subscribe({
        next: (projectData) => {
          if (projectData) {
            this.project = { ...projectData, id: projectId };
            this.isLoading = false;
          } else {
            this.errorSer.handleError('Project not found.');
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.errorSer.handleError('Failed to load project details. Please try again later.');
          this.isLoading = false;
        }
      });
    } else {
      this.errorSer.handleError('Invalid project ID provided.');
      this.isLoading = false;
    }
  }

  getPlatformIcon(platform: string): string {
    switch (platform.toLowerCase()) {
      case 'web': return 'fas fa-globe';
      case 'android': return 'fab fa-android';
      case 'ios': return 'fab fa-apple';
      default: return 'fas fa-link';
    }
  }
  getTechIcon(tech: string): string {
    switch (tech.toLowerCase()) {
      case 'angular': return 'fab fa-angular';
      case 'node.js': return 'fab fa-node-js';
      case 'express.js': return 'fas fa-server';
      case 'mongodb': return 'fas fa-database';
      case 'firebase': return 'fas fa-fire';
      case 'material ui': return 'fas fa-layer-group';
      case 'ng-prime': return 'fas fa-gem';
      case 'sql-lite': return 'fas fa-database sqlite';
      case 'my sql': return 'fas fa-database sql';
      default: return 'fas fa-code';
    }
  }
}