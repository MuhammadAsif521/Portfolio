import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService, Project } from '../../Server/firebase.service';
import { NgClass, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports:[TitleCasePipe,ReactiveFormsModule,NgClass]
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  isModalOpen = false;
  isEditing = false;
  editingProjectId: string | null = null;
  isSubmitting = false;
  statusMessage = '';
  statusClass = '';

  projectForm: FormGroup;

  categoryOptions = [
    { value: 'web', label: 'Web Apps', icon: 'fas fa-globe' },
    { value: 'mobile', label: 'Mobile Apps', icon: 'fas fa-mobile-alt' },
    { value: 'backend', label: 'Backend', icon: 'fas fa-server' },
    { value: 'desktop', label: 'Desktop Apps', icon: 'fas fa-desktop' }
  ];

  statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'planned', label: 'Planned' }
  ];

  constructor(
    private firebaseService: FirebaseService,
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      categoryIcon: ['', Validators.required],
      image: ['', Validators.required],
      liveUrl: ['', Validators.required],
      codeUrl: ['', Validators.required],
      status: ['', Validators.required],
      date: ['', Validators.required],
      technologies: ['', Validators.required],
      featured: [false]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.firebaseService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingProjectId = null;
    this.projectForm.reset();
    this.projectForm.patchValue({
      featured: false,
      category: 'web',
      categoryIcon: 'fas fa-globe',
      status: 'completed'
    });
    this.isModalOpen = true;
  }

  openEditModal(project: Project): void {
    this.isEditing = true;
    this.editingProjectId = project.id!;
    this.projectForm.patchValue({
      ...project,
      technologies: project.technologies.join(', ')
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.projectForm.reset();
    this.statusMessage = '';
  }

  onCategoryChange(): void {
    const category = this.projectForm.get('category')?.value;
    const categoryOption = this.categoryOptions.find(opt => opt.value === category);
    if (categoryOption) {
      this.projectForm.patchValue({ categoryIcon: categoryOption.icon });
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isSubmitting = true;
      this.statusMessage = '';

      const formData = this.projectForm.value;
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map((tech: string) => tech.trim())
      };

      if (this.isEditing && this.editingProjectId) {
        this.firebaseService.updateProject(this.editingProjectId, projectData).subscribe({
          next: () => {
            this.statusMessage = 'Project updated successfully!';
            this.statusClass = 'success';
            setTimeout(() => {
              this.closeModal();
              this.loadProjects();
            }, 1500);
          },
          error: (error) => {
            this.isSubmitting = false;
            this.statusMessage = 'Error updating project. Please try again.';
            this.statusClass = 'error';
          }
        });
      } else {
        this.firebaseService.addProject(projectData).subscribe({
          next: () => {
            this.statusMessage = 'Project added successfully!';
            this.statusClass = 'success';
            setTimeout(() => {
              this.closeModal();
              this.loadProjects();
            }, 1500);
          },
          error: (error) => {
            this.isSubmitting = false;
            this.statusMessage = 'Error adding project. Please try again.';
            this.statusClass = 'error';
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.firebaseService.deleteProject(projectId).subscribe({
        next: () => {
          this.loadProjects();
        },
        error: (error) => {
          console.error('Error deleting project:', error);
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.projectForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters.`;
      }
    }
    return '';
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
