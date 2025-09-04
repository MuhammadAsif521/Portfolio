import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from '../../Server/firebase.service';
import { FormControlComponent } from "../form-control/form-control.component";
import { ToastService } from '../../Server/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, FormControlComponent]
})
export class LoginComponent {
  private firebaseService: FirebaseService = inject(FirebaseService);
  private router: Router = inject(Router);
  private toastSer = inject(ToastService);
  loginForm: FormGroup = new FormGroup({});
  isSubmitting = false;

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;

      const { email, password } = this.loginForm.value;
      this.firebaseService.login(email, password).subscribe({
        next: () => {
          // ✅ Success Toast
          this.toastSer.showToast(
            'fas fa-check-circle', // icon
            'Login successful! Redirecting...', // message
            'success' // color
          );

          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.isSubmitting = false;

          const errorMessage = this.getErrorMessage(error.code);

          // ✅ Error Toast
          this.toastSer.showToast(
            'fas fa-exclamation-triangle', // icon
            errorMessage, // message
            'danger' // color
          );
        }
      });
    }
  }
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred during login. Please try again.';
    }
  }
}
