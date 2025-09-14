import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControlComponent } from 'src/app/core/components/form-control/form-control.component';
import { ScrollAnimationService } from 'src/app/core/components/scroll-animation';
import { ApiService } from 'src/app/core/Services/api.service';
import { ToastService, ErrorHandlerService } from 'src/app/core/Services/toast.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  imports: [ReactiveFormsModule, FormControlComponent]
})
export class ContactPage implements AfterViewInit {
  private elementRef = inject(ElementRef);
  private scrollAnim = inject(ScrollAnimationService);
  private toastSer = inject(ToastService);
  private errorToast = inject(ErrorHandlerService);
  private publicApi = inject(ApiService);

  contactForm: FormGroup = new FormGroup({});
  isSubmitting = false;

  ngAfterViewInit(): void {
    this.scrollAnim.observeFadeIn(this.elementRef);
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.toastSer.showToast(
        'fas fa-exclamation-triangle',
        'Please fill in all required fields.',
        'warning'
      );
      return;
    }

    this.isSubmitting = true;
    const formData = this.contactForm.value;

    this.publicApi.sendMessage(formData).subscribe({
      next: () => {
        this.toastSer.showToast(
          'fas fa-check-circle',
          'Message sent successfully!',
          'success'
        );
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorToast.handleError(error);
        this.isSubmitting = false;
      }
    });
  }
}
