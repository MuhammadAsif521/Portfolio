import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FooterComponent } from "src/app/core/components/footer/footer.component";
import { Project } from 'src/app/core/interfaces/core.interface';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  imports: [TitleCasePipe, FooterComponent],
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
      image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
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
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
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
      image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
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
      image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
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
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
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
      image: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      liveUrl: '#',
      codeUrl: '#',
      status: 'planning',
      date: 'Mar 2025'
    },
    {
      title: 'Finance Dashboard',
      description: 'Interactive financial dashboard with data visualization, expense tracking, and budget planning tools.',
      features: [
        'Income and expense tracking',
        'Budget planning tools',
        'Interactive charts and graphs',
        'Financial goal setting',
        'Export financial reports'
      ],
      tags: ['React', 'D3.js', 'Firebase', 'Material UI'],
      category: 'web',
      categoryIcon: 'fas fa-chart-line',
      image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      liveUrl: '#',
      codeUrl: '#',
      status: 'completed',
      date: 'Aug 2024'
    },
    {
      title: 'Recipe Finder App',
      description: 'Mobile application for discovering recipes based on available ingredients with step-by-step cooking instructions.',
      features: [
        'Ingredient-based recipe search',
        'Step-by-step cooking instructions',
        'Shopping list generation',
        'Favorite recipes saving',
        'Nutritional information'
      ],
      tags: ['Flutter', 'Firebase', 'Spoonacular API', 'Cloud Functions'],
      category: 'mobile',
      categoryIcon: 'fas fa-utensils',
      image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      liveUrl: '#',
      codeUrl: '#',
      status: 'completed',
      date: 'Jul 2024'
    },
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