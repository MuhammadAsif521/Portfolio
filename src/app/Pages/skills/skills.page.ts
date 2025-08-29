import { Component, OnInit, AfterViewInit, ElementRef, inject } from '@angular/core';
import { FooterComponent } from "src/app/core/components/footer/footer.component";

interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
  level: number;
}

interface Tool {
  name: string;
  icon: string;
}

interface Certification {
  title: string;
  issuer: string;
  year: string;
  icon: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.page.html',
  styleUrls: ['./skills.page.scss'],
  imports: [FooterComponent]
})
export class SkillsPage implements OnInit, AfterViewInit {

  private elementRef: ElementRef = inject (ElementRef);

  skillCategories: SkillCategory[] = [
    {
      name: 'Frontend Development',
      icon: 'fas fa-code',
      level: 90,
      skills: [
        'Ionic Angular',
        'Capacitor',
        'Angular Standalone',
        'TypeScript',
        'Tailwind CSS',
        'SCSS',
        'HTML5',
        'Responsive Design'
      ]
    },
    {
      name: 'Backend Development',
      icon: 'fas fa-server',
      level: 55,
      skills: [
        'Node.js',
        'Express.js',
        'Firebase Admin SDK',
        'MongoDB',
        'RESTful APIs',
        'Socket.io'
      ]
    },
    {
      name: 'Authentication & Security',
      icon: 'fas fa-shield-alt',
      level: 75,
      skills: [
        'Google OAuth',
        'Facebook OAuth',
        'LinkedIn OAuth',
        'Firebase Auth',
        'OTP (Twilio)',
        'JWT'
      ]
    },
    {
      name: 'Mobile & Cross-Platform',
      icon: 'fas fa-mobile-alt',
      level: 90,
      skills: [
        'Ionic + Capacitor',
        'Android',
        'iOS',
        'Progressive Web Apps',
        'Hybrid Apps'
      ]
    },
    {
      name: 'Cloud & DevOps',
      icon: 'fas fa-cloud',
      level: 75,
      skills: [
        'Firebase',
        'Google Cloud',
        'Netlify',
        'Vercel',
        'Heroku',
        'Git & GitHub'
      ]
    },
    {
      name: 'APIs & Integrations',
      icon: 'fas fa-plug',
      level: 80,
      skills: [
        'OpenWeather API',
        'Twilio',
        'Social Media APIs',
        'Payment Gateways',
        'Barcode/QR Scanning'
      ]
    }
  ];

  additionalTools: Tool[] = [
    { name: 'VS Code', icon: 'fas fa-code' },
    { name: 'Android Studio', icon: 'fab fa-android' },
    { name: 'Xcode', icon: 'fab fa-apple' },
    { name: 'Postman', icon: 'fas fa-paper-plane' },
    { name: 'Figma', icon: 'fab fa-figma' },
    { name: 'Firebase Console', icon: 'fas fa-fire' },
    { name: 'MongoDB Compass', icon: 'fas fa-database' },
    { name: 'npm/yarn', icon: 'fab fa-npm' }
  ];

  // certifications: Certification[] = [
  //   {
  //     title: 'Angular Certified Developer',
  //     issuer: 'Google Angular Team',
  //     year: '2023',
  //     icon: 'fab fa-angular'
  //   },
  //   {
  //     title: 'Firebase Certified',
  //     issuer: 'Google Cloud',
  //     year: '2023',
  //     icon: 'fas fa-fire'
  //   },
  //   {
  //     title: 'Node.js Application Development',
  //     issuer: 'OpenJS Foundation',
  //     year: '2022',
  //     icon: 'fab fa-node-js'
  //   },
  //   {
  //     title: 'Mobile App Development',
  //     issuer: 'Ionic Framework',
  //     year: '2024',
  //     icon: 'fas fa-mobile-alt'
  //   }
  // ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
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

          // Trigger skill level animations
          if (entry.target.classList.contains('skill-category')) {
            this.animateSkillLevel(entry.target);
          }
        }
      });
    }, observerOptions);

    const fadeElements = this.elementRef.nativeElement.querySelectorAll('.fade-in');
    fadeElements.forEach((el: Element) => observer.observe(el));
  }

  private animateSkillLevel(element: Element): void {
    const levelFill = element.querySelector('.level-fill') as HTMLElement;
    if (levelFill) {
      const targetWidth = levelFill.style.width;
      levelFill.style.width = '0';

      setTimeout(() => {
        levelFill.style.width = targetWidth;
      }, 300);
    }
  }
}
