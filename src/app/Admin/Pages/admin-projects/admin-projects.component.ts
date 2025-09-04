import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../Server/firebase.service';
import { ProjectCardsComponent } from "src/app/core/components/project-cards/project-cards.component";
import { UtilityService } from 'src/app/core/Services/utility.service';
import { Projects } from 'src/app/core/interfaces/core.interface';

@Component({
  selector: 'app-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss'],
  imports: [ReactiveFormsModule, ProjectCardsComponent]
})
export class AdminProjectsComponent implements OnInit {
  public utilSer = inject(UtilityService);
  private firebaseService = inject(FirebaseService);
  projects: Projects[] = [];

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.firebaseService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
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
}
