import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { UtilityService } from '../../Services/utility.service';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public utilSer = inject(UtilityService);
  private router = inject(Router);

  public isMobileMenuOpen = false;
  public isScrolled = false;
  public activeRoute = '/home';
  public touchStartX = 0;
  public touchEndX = 0;

  ngOnInit(): void {
    this.setActiveRoute(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveRoute(event.urlAfterRedirects);
      });
  }

  private setActiveRoute(url: string): void {
    if (url.startsWith('/project-details')) {
      this.activeRoute = '/projects';
    } else {
      this.activeRoute = url;
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (
      this.isMobileMenuOpen &&
      navLinks &&
      !navLinks.contains(target) &&
      mobileMenu &&
      !mobileMenu.contains(target)
    ) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  setActive(route: string): void {
    this.activeRoute = route;
    this.utilSer.navigateTo(route);
    this.isMobileMenuOpen = false;
  }


  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }
  private handleSwipe(): void {
    const swipeDistance = this.touchEndX - this.touchStartX;
    if (swipeDistance > 80 && !this.isMobileMenuOpen) {
      this.isMobileMenuOpen = true;
    }
    if (swipeDistance < -80 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

}
