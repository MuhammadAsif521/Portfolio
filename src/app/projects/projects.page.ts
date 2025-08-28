// projects.component.ts
import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

interface Project {
  title: string;
  description: string;
  features: string[];
  tags: string[];
  category: 'mobile' | 'web' | 'backend' | 'fullstack';
  categoryIcon: string;
  gradient: string;
  liveUrl: string;
  codeUrl: string;
  status: 'completed' | 'ongoing' | 'planning';
  date: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  imports:[TitleCasePipe],
})
export class ProjectsPage implements OnInit, AfterViewInit {
  activeFilter: string = 'all';
  filteredProjects: Project[] = [];

  projects: Project[] = [
    {
      title: 'WeatherPro Mobile App',
      description: 'A comprehensive weather application built with Ionic Angular and Capacitor, featuring real-time weather data, location services, and beautiful UI animations.',
      features: [
        'Real-time weather data from OpenWeather API',
        'GPS location services',
        '7-day weather forecast',
        'Interactive weather maps',
        'Push notifications for weather alerts'
      ],
      tags: ['Ionic', 'Angular', 'Capacitor', 'OpenWeather API', 'TypeScript'],
      category: 'mobile',
      categoryIcon: 'fas fa-mobile-alt',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      liveUrl: '#',
      codeUrl: '#',
      status: 'completed',
      date: 'Dec 2024'
    },
    {
      title: 'AuthFlow - Authentication System',
      description: 'Complete authentication solution supporting multiple OAuth providers, OTP verification, and role-based access control with Firebase integration.',
      features: [
        'Multiple OAuth providers (Google, Facebook, LinkedIn)',
        'OTP verification via Twilio',
        'Role-based access control',
        'JWT token management',
        'Password reset functionality'
      ],
      tags: ['Firebase', 'OAuth', 'Node.js', 'Express', 'Twilio'],
      category: 'backend',
      categoryIcon: 'fas fa-shield-alt',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      liveUrl: '#',
      codeUrl: '#',
      status: 'completed',
      date: 'Nov 2024'
    },
    {
      title: 'ChatConnect - Real-time Messaging',
      description: 'Real-time chat application with Socket.io, featuring message encryption, file sharing, and push notifications across all platforms.',
      features: [
        'Real-time messaging with Socket.io',
        'End-to-end message encryption',
        'File and media sharing',
        'Group chat functionality',
        'Cross-platform push notifications'
      ],
      tags: ['Socket.io', 'MongoDB', 'Firebase', 'Push Notifications'],
      category: 'fullstack',
      categoryIcon: 'fas fa-comments',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      liveUrl: '#',
      codeUrl: '#',
      status: 'ongoing',
      date: 'Jan 2025'
    },
    {
      title: 'QR Scanner Pro',
      description: 'Professional QR and barcode scanning application with batch processing, history tracking, and export functionality.',
      features: [
        'QR code and barcode scanning',
        'Batch processing capabilities',
        'Scan history with search',
        'Export data to CSV/PDF',
        'Custom QR code generation'
      ],
      tags: ['Capacitor', 'Camera API', 'SQLite', 'File System'],
      category: 'mobile',
      categoryIcon: 'fas fa-qrcode',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      liveUrl: '#',
      codeUrl: '#',
      status: 'completed',
      date: 'Oct 2024'
    },
    {
      title: 'TaskMaster - Project Management',
      description: 'Comprehensive project management tool with team collaboration, time tracking, and detailed analytics dashboard.',
      features: [
        'Project and task management',
        'Team collaboration tools',
        'Time tracking and reporting',
        'Analytics dashboard with charts',
        'File sharing and comments'
      ],
      tags: ['Angular', 'Node.js', 'PostgreSQL', 'Chart.js'],
      category: 'web',
      categoryIcon: 'fas fa-tasks',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      liveUrl: '#',
      codeUrl: '#',
      status: 'completed',
      date: 'Sep 2024'
    },
    {
      title: 'EcoTrack - Carbon Footprint',
      description: 'Environmental tracking app that helps users monitor and reduce their carbon footprint with gamification elements.',
      features: [
        'Carbon footprint calculation',
        'Daily activity tracking',
        'Gamification with achievements',
        'Environmental tips and challenges',
        'Progress analytics and reports'
      ],
      tags: ['Ionic', 'Charts', 'Geolocation', 'Progressive Web App'],
      category: 'mobile',
      categoryIcon: 'fas fa-leaf',
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      liveUrl: '#',
      codeUrl: '#',
      status: 'planning',
      date: 'Mar 2025'
    }
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.filteredProjects = [...this.projects];
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project => 
        project.category === filter
      );
    }

    // Animate filtered projects
    setTimeout(() => {
      this.setupScrollAnimations();
    }, 100);
  }

  isProjectVisible(project: Project): boolean {
    return this.activeFilter === 'all' || project.category === this.activeFilter;
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