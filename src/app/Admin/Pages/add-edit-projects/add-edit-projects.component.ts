import { Component, inject, OnInit, effect, signal } from '@angular/core';
import { FormSelectorComponent } from "../form-selector/form-selector.component";
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { FormControlComponent } from "../form-control/form-control.component";
import { ToastService, ErrorHandlerService } from '../../Server/toast.service';
import { FirebaseService } from '../../Server/firebase.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Projects } from 'src/app/core/interfaces/core.interface';
import { take } from 'rxjs';
import { UtilityService } from 'src/app/core/Services/utility.service';

@Component({
  selector: 'add-edit-projects',
  templateUrl: './add-edit-projects.component.html',
  styleUrls: ['./add-edit-projects.component.scss'],
  imports: [FormSelectorComponent, ReactiveFormsModule, FormControlComponent],
  standalone: true
})
export class AddEditProjectsComponent implements OnInit {
  // Services
  private toastSer = inject(ToastService);
  private errorSer = inject(ErrorHandlerService);
  private utilSer = inject(UtilityService);
  private fb = inject(FormBuilder);
  private firebaseSer = inject(FirebaseService);
  private route = inject(ActivatedRoute);

  // Signals
  public editMode = signal<boolean>(false);
  public isSubmitting = signal<boolean>(false);
  public projectId = signal<string | null>(null);
  public currentProject = signal<Projects | null>(null);

  // Form
  public projectForm: FormGroup = new FormGroup({});

  // Track if new images are uploaded
  private hasNewImages = false;

  // Options
  Types = ['Full Stack', 'Frontend', 'Mobile Apps'];
  Framework = ['Mean Stack', 'Ionic', 'Capacitor', 'Cordova'];
  Status = ['Completed', 'In-Progress', 'Planned'];
  Availibilty = ['Web', 'Android', 'IOS'];
  Technologies = ['Angular', 'Node.js', 'Express.js', 'MongoDB', 'Firebase', 'Material UI', 'Ng-Prime', 'Sql-Lite', 'My Sql'];

  constructor() {
    // Effect to handle route changes and determine edit mode
    effect(() => {
      const projectIdFromRoute = this.route.snapshot.params['id'];
      if (projectIdFromRoute) {
        this.editMode.set(true);
        this.projectId.set(projectIdFromRoute);
        this.loadProjectData(projectIdFromRoute);
      } else {
        this.editMode.set(false);
        this.projectId.set(null);
        this.currentProject.set(null);
      }
    });

    // Effect to patch form when project data is loaded
    effect(() => {
      const project = this.currentProject();
      if (project && this.editMode()) {
        this.patchFormWithProjectData(project);
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      clientname: ['', Validators.required],
      members: [1, [Validators.required, Validators.min(1)]],
      liveUrl: [''],
      codeUrl: [''],
      framework: [[]],
      from: ['', Validators.required],
      to: [''],
      availibillty: [[]],
      'availibillty-urls': [[]],
      technologies: [[]],
      description: [''],
      role: [[]],
      keyfeatures: [[]],
      Images: [[]]
    });

    // Track when new images are selected
    this.projectForm.get('Images')?.valueChanges.subscribe((newImages) => {
      this.hasNewImages = newImages && newImages.length > 0 && newImages[0] instanceof File;
    });
  }

  private loadProjectData(projectId: string): void {
    this.firebaseSer.getProject(projectId).pipe(take(1)).subscribe({
      next: (project) => {
        if (project) {
          this.currentProject.set(project);
        } else {
          this.errorSer.handleError('Project not found');
          this.utilSer.navigateTo('/admin/project');
        }
      },
      error: (err) => {
        this.errorSer.handleError('Error loading project data');
        console.error('Error loading project:', err);
      }
    });
  }

  private patchFormWithProjectData(project: Projects): void {
    const fromDate = project.from ? this.formatDateForMonthInput(project.from) : '';
    const toDate = project.to ? this.formatDateForMonthInput(project.to) : '';

    setTimeout(() => {
      this.projectForm.patchValue({
        title: project.title || '',
        type: project.type || '',
        status: project.status || '',
        members: project.members || 1,
        clientname: project.clientname || '',
        liveUrl: project.liveUrl || '',
        codeUrl: project.codeUrl || '',
        framework: project.framework || [],
        from: fromDate,
        to: toDate,
        availibillty: project.availibillty || [],
        'availibillty-urls': project['availibillty-urls'] || [],
        technologies: project.technologies || [],
        description: project.description || '',
        role: project.role || [],
        keyfeatures: project.keyfeatures || [],
        Images: project.Images || [] // Keep existing image URLs
      });

      this.projectForm.markAsPristine();
      this.projectForm.markAsUntouched();
      this.hasNewImages = false; // Reset new images flag
    }, 100);
  }

  private formatDateForMonthInput(date: any): string {
    if (!date) return '';

    let dateObj: Date;
    if (date.toDate && typeof date.toDate === 'function') {
      dateObj = date.toDate();
    } else if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      return '';
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.errorSer.handleError('Please fill out the required fields correctly.');
      return;
    }

    this.isSubmitting.set(true);

    this.firebaseSer.isAuthenticated().pipe(take(1)).subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.errorSer.handleError('You must be logged in to submit projects.');
        this.isSubmitting.set(false);
        return;
      }

      const formValues = this.projectForm.value;
      const newImages: File[] = formValues.Images?.filter((img: any) => img instanceof File) || [];

      if (this.editMode()) {
        this.handleEditModeSubmission(formValues, newImages);
      } else {
        this.handleAddModeSubmission(formValues, newImages);
      }
    });
  }

  private handleEditModeSubmission(formValues: any, newImages: File[]): void {
    const currentProject = this.currentProject();
    if (!currentProject) {
      this.errorSer.handleError('Current project data not found');
      this.isSubmitting.set(false);
      return;
    }

    if (newImages.length > 0) {
      // New images uploaded - delete old ones and upload new ones
      const oldImageUrls = currentProject.Images || [];
      
      // First upload new images
      this.firebaseSer.uploadImages(newImages).subscribe({
        next: (newImageUrls) => {
          // Delete old images from storage
          if (oldImageUrls.length > 0) {
            this.firebaseSer.deleteImages(oldImageUrls).subscribe({
              next: () => {
                console.log('Old images deleted successfully');
                this.processProjectSubmission(formValues, newImageUrls);
              },
              error: (err) => {
                console.warn('Failed to delete some old images, but continuing with update:', err);
                this.processProjectSubmission(formValues, newImageUrls);
              }
            });
          } else {
            this.processProjectSubmission(formValues, newImageUrls);
          }
        },
        error: (err) => {
          this.errorSer.handleError('Error uploading new images');
          this.isSubmitting.set(false);
        }
      });
    } else {
      // No new images - keep existing images
      const existingImages = currentProject.Images || [];
      this.processProjectSubmission(formValues, existingImages);
    }
  }

  private handleAddModeSubmission(formValues: any, newImages: File[]): void {
    if (newImages.length > 0) {
      this.firebaseSer.uploadImages(newImages).subscribe({
        next: (imageUrls) => {
          this.processProjectSubmission(formValues, imageUrls);
        },
        error: (err) => {
          this.errorSer.handleError('Error uploading images');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.processProjectSubmission(formValues, []);
    }
  }

  private processProjectSubmission(formValues: any, imageUrls: string[]): void {
    const projectData = {
      ...formValues,
      role: Array.isArray(formValues.role)
        ? formValues.role
        : (formValues.role
          ? formValues.role
            .split('\n')
            .map((r: string) => r.trim())
            .filter((r: string) => r.length > 0)
          : []),
      keyfeatures: Array.isArray(formValues.keyfeatures)
        ? formValues.keyfeatures
        : (formValues.keyfeatures
          ? formValues.keyfeatures
            .split('\n')
            .map((f: string) => f.trim())
            .filter((f: string) => f.length > 0)
          : []),
      Images: imageUrls,
      ['availibillty-urls']: Array.isArray(formValues['availibillty-urls'])
        ? formValues['availibillty-urls']
        : (typeof formValues['availibillty-urls'] === 'string'
          ? formValues['availibillty-urls']
            .split(',')
            .map((url: string) => url.trim())
            .filter((url: string) => url.length > 0)
          : [])
    };

    if (this.editMode()) {
      this.updateProject(projectData);
    } else {
      this.addProject(projectData);
    }
  }

  private updateProject(projectData: any): void {
    const id = this.projectId();
    if (!id) {
      this.errorSer.handleError('Project ID not found');
      this.isSubmitting.set(false);
      return;
    }

    this.firebaseSer.updateProject(id, projectData).subscribe({
      next: () => {
        this.toastSer.showToast('fas fa-check-circle', 'Project updated successfully!', 'success');
        this.isSubmitting.set(false);
        this.utilSer.navigateTo('/admin/project');
      },
      error: (err) => {
        this.errorSer.handleError('Error updating project');
        this.isSubmitting.set(false);
      }
    });
  }

  private addProject(projectData: any): void {
    this.firebaseSer.addProject(projectData).subscribe({
      next: () => {
        this.toastSer.showToast('fas fa-check-circle', 'Project added successfully!', 'success');
        this.isSubmitting.set(false);
        this.resetForm();
        this.utilSer.navigateTo('/admin/project');
      },
      error: (err) => {
        this.errorSer.handleError('Error adding project');
        this.isSubmitting.set(false);
      }
    });
  }

  private resetForm(): void {
    this.projectForm.reset();
    this.hasNewImages = false;
    this.initializeForm();
  }

  onCancel(): void {
    this.utilSer.navigateTo('/admin/project');
  }
}