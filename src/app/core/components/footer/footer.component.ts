
// footer.component.ts
import { Component, OnInit } from '@angular/core';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  socialLinks: SocialLink[] = [
    {
      name: 'LinkedIn',
      url: '#',
      icon: 'fab fa-linkedin-in'
    },
    {
      name: 'GitHub',
      url: '#',
      icon: 'fab fa-github'
    },
    {
      name: 'Twitter',
      url: '#',
      icon: 'fab fa-twitter'
    },
    {
      name: 'Email',
      url: 'mailto:m.asif340315@gmail.com',
      icon: 'fas fa-envelope'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const targetPosition = element.offsetTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}
