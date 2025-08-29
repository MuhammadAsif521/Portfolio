import { NgClass } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from "src/app/core/components/footer/footer.component";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  imports: [ReactiveFormsModule, NgClass, FooterComponent]
})
export class ContactPage implements OnInit, AfterViewInit {
  private fb: FormBuilder = inject(FormBuilder);
  private elementRef: ElementRef = inject(ElementRef);
  contactForm: FormGroup;
  isSubmitting = false;
  statusMessage = '';
  statusClass = '';
  statusIcon = '';

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.statusMessage = '';

    try {
      const formData = this.contactForm.value;

      // Create mailto link
      const emailBody = `Hello Muhammad Asif,

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
This message was sent from your portfolio contact form.`;

      const mailtoLink = `mailto:m.asif340315@gmail.com?subject=Portfolio Contact: ${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;

      // Open email client
      window.open(mailtoLink, '_blank');

      // Simulate processing time
      await this.delay(1500);

      this.statusMessage = 'Your email client has opened! Please send the email to complete your message.';
      this.statusClass = 'success';
      this.statusIcon = 'fas fa-check-circle';

      // Reset form after delay
      setTimeout(() => {
        this.contactForm.reset();
        this.statusMessage = '';
      }, 5000);

    } catch (error) {
      this.statusMessage = 'Something went wrong. Please try again or email directly at m.asif340315@gmail.com';
      this.statusClass = 'error';
      this.statusIcon = 'fas fa-exclamation-circle';
    } finally {
      this.isSubmitting = false;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);

    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} must be at least ${requiredLength} characters`;
      }
    }

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message'
    };
    return displayNames[fieldName] || fieldName;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private setupScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const fadeElements = this.elementRef.nativeElement.querySelectorAll('.fade-in');
    fadeElements.forEach((el: Element) => observer.observe(el));
  }
}
