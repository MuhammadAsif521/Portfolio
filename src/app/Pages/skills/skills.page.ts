import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { FooterComponent } from "src/app/core/components/footer/footer.component";
import { ScrollAnimationService } from 'src/app/core/components/scroll-animation';
import { SkillCategory, Tool } from 'src/app/core/interfaces/core.interface';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.page.html',
  styleUrls: ['./skills.page.scss'],
  imports: [FooterComponent]
})
export class SkillsPage implements AfterViewInit {

  private elementRef = inject(ElementRef);
  private scrollAnim = inject(ScrollAnimationService);

  skillCategories: SkillCategory[] = [
    {
      name: 'Frontend Development',
      icon: 'fas fa-code',
      level: 95,
      skills: [
        'Ionic Angular',
        'Capacitor',
        'Angular Standalone',
        'TypeScript',
        'Tailwind CSS',
        'SCSS',
        'HTML5',
        'Responsive Design',
        'Animations & Micro-interactions'
      ]
    },
    {
      name: 'Backend Development',
      icon: 'fas fa-server',
      level: 60,
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
      level: 70,
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
    },
    {
      name: 'Soft Skills',
      icon: 'fas fa-users',
      level: 90,
      skills: [
        'Teamwork & Collaboration',
        'Effective Communication',
        'Problem-solving & Critical Thinking',
        'Adaptability & Learning',
        'Time Management & Deadlines'
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

  ngAfterViewInit(): void {
    this.scrollAnim.observeFadeIn(this.elementRef, (el: Element) => {
      if (el.classList.contains('skill-category')) {
        this.animateSkillLevel(el);
      }
    });
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
