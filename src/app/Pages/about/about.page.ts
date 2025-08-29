import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FooterComponent } from "src/app/core/components/footer/footer.component";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface TimelineItem {
  title: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone:true,
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  imports: [FooterComponent]
})
export class AboutPage implements OnInit, AfterViewInit {

  stats: Stat[] = [
    { value: 50, suffix: '+', label: 'Projects Completed' },
    { value: 3, suffix: '+', label: 'Years Experience' },
    { value: 100, suffix: '%', label: 'Client Satisfaction' },
    { value: 24, suffix: '/7', label: 'Support Available' }
  ];

  timeline: TimelineItem[] = [
    {
      title: 'Started Web Development Journey',
      date: '2021',
      description: 'Began learning web technologies, focusing on HTML, CSS, and JavaScript fundamentals.'
    },
    {
      title: 'Mastered Angular & Ionic',
      date: '2022',
      description: 'Specialized in Angular framework and Ionic for mobile app development, creating my first hybrid applications.'
    },
    {
      title: 'Full-Stack Development',
      date: '2023',
      description: 'Expanded skills to include Node.js, Express, and databases, becoming a complete full-stack developer.'
    },
    {
      title: 'Professional Projects',
      date: '2024',
      description: 'Delivered multiple client projects, focusing on cross-platform solutions and modern development practices.'
    }
  ];

  constructor(private elementRef: ElementRef) {}

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

          // Trigger count-up animation for stats
          if (entry.target.classList.contains('stats-grid')) {
            this.animateStats();
          }
        }
      });
    }, observerOptions);

    const fadeElements = this.elementRef.nativeElement.querySelectorAll('.fade-in');
    fadeElements.forEach((el: Element) => observer.observe(el));
  }

  private animateStats(): void {
    const statNumbers = this.elementRef.nativeElement.querySelectorAll('.stat-number span[countUp]');

    statNumbers.forEach((element: HTMLElement) => {
      const target = parseInt(element.getAttribute('countUp') || '0');
      const duration = parseInt(element.getAttribute('duration') || '2000');
      this.countUp(element, target, duration);
    });
  }

  private countUp(element: HTMLElement, target: number, duration: number): void {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toString();
    }, 16);
  }
}
