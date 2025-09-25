import { NgClass } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/Services/api.service';
import { ErrorHandlerService } from 'src/app/core/Services/toast.service';
import { UtilityService } from 'src/app/core/Services/utility.service';
import { Project } from 'src/app/core/interfaces/core.interface';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgClass],
  standalone: true,
})
export class ProjectDetailsPage implements OnInit {
  public utilSer = inject(UtilityService);
  private route = inject(ActivatedRoute);
  private errorSer = inject(ErrorHandlerService);
  private publicApi = inject(ApiService);

  public project!: Project;
  public isLoading = true;
  public error: string | null = null;

public descriptionParts: string[] = [];

ngOnInit(): void {
  const projectId = this.route.snapshot.paramMap.get('id');
  if (projectId) {
    this.publicApi.getProjectById(projectId).subscribe({
      next: (res) => {
        if (res.project) {
          this.project = { ...res.project, _id: projectId };

          if (this.project.description) {
            const maxCharsPerParagraph = 700; // approx. 5 lines
            let desc = this.project.description.trim();
            let start = 0;

            this.descriptionParts = [];

            while (start < desc.length) {
              // Take a substring
              let chunk = desc.slice(start, start + maxCharsPerParagraph);

              // Try to break at the last period inside the chunk for clean sentences
              const lastPeriod = chunk.lastIndexOf('.');
              const splitIndex = lastPeriod > 0 ? lastPeriod + 1 : chunk.length;

              this.descriptionParts.push(chunk.slice(0, splitIndex).trim());
              start += splitIndex;
            }
          }

          this.isLoading = false;
        } else {
          this.errorSer.handleError('Project not found.');
          this.isLoading = false;
        }
      },
      error: () => {
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
  getFrameworkClass(name: string): string {
    const map: Record<string, string> = {
      'Mean Stack': 'mean-stack',
      'Ionic': 'ionic',
      'Capacitor': 'capacitor',
      'Cordova': 'cordova'
    };

    return map[name] || 'default-framework';
  }

}
