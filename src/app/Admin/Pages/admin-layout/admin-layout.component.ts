import { Component, OnInit, inject, HostListener } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FirebaseService } from '../../Server/firebase.service';
import { UtilityService } from 'src/app/core/Services/utility.service';
import { filter } from 'rxjs';
import { AdminUser } from 'src/app/core/interfaces/core.interface';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  imports: [RouterOutlet]
})
export class AdminLayoutComponent implements OnInit {
  private firebaseService: FirebaseService = inject(FirebaseService);
  private router: Router = inject(Router);
  public utilSer = inject(UtilityService);

  currentUser: AdminUser | null = null;
  unreadMessagesCount = 0;
  isMobileMenuOpen = false;
  activeRoute = '/admin/dashboard';

  ngOnInit(): void {
    // Get current user
    this.firebaseService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    // Get unread messages count
    this.firebaseService.getUnreadMessagesCount().subscribe(count => {
      this.unreadMessagesCount = count;
    });

    // Initial route set karo
    this.activeRoute = this.router.url;

    // Router events suno (back/forward bhi handle karega)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.urlAfterRedirects;
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (
      this.isMobileMenuOpen &&
      sidebar &&
      !sidebar.contains(target) &&
      mobileMenuBtn &&
      !mobileMenuBtn.contains(target)
    ) {
      this.isMobileMenuOpen = false;
    }
  }

  logout(): void {
    this.firebaseService.logout().subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }
  shouldShowBackButton(): boolean {
    const isDashboard = this.activeRoute === '/admin/dashboard';
    const isMobile = window.innerWidth <= 992;
    return !(isDashboard || isMobile);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  setActive(route: string): void {
    this.activeRoute = route;
    this.utilSer.navigateTo(route);
    this.closeMobileMenu();
  }

  getPageTitle(): string {
    if (this.activeRoute === '/admin/dashboard') {
      return 'Admin Dashboard';
    }
    if (this.activeRoute === '/admin/project') {
      return 'Project Management';
    }
    if (this.activeRoute === '/admin/messages') {
      return 'Message Center';
    }
    if (this.activeRoute === '/admin/add-project') {
      return 'Add Project';
    }
    if (this.activeRoute.startsWith('/admin/edit-project/')) {
      return 'Edit Project';
    }
    if (this.activeRoute === '/blogs') {
      return 'Blogs';
    }
    return 'Admin Panel';
  }

}