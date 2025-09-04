import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../Admin/Server/firebase.service';
import { FormControlComponent } from "src/app/Admin/Pages/form-control/form-control.component";
import { ToastService, ErrorHandlerService } from 'src/app/Admin/Server/toast.service';
import { ScrollAnimationService } from 'src/app/core/components/scroll-animation';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  imports: [ReactiveFormsModule, FormControlComponent]
})
export class ContactPage implements  AfterViewInit {
  private elementRef = inject(ElementRef);
  private scrollAnim = inject(ScrollAnimationService);
  private toastSer = inject(ToastService);
  private errorToast = inject(ErrorHandlerService);
  private firebaseService: FirebaseService = inject(FirebaseService);

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
    try {
      const formData = this.contactForm.value;
      this.firebaseService.addMessage(formData).subscribe({
        next: () => {
          this.toastSer.showToast(
            'fas fa-check-circle',
            'Message sent successfully!',
            'success'
          );
         this.contactForm.reset();
        },
        error: (error) => {
          this.errorToast.handleError(error);
        }
      });
    } catch (error) {
      this.errorToast.handleError('Something went wrong. Please try again later.',);
    } finally {
      this.isSubmitting = false;
    }
  }
}
