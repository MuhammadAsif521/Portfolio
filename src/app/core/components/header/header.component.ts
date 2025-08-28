import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UtilityService } from 'src/app/Services/utility.service';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public utilSer = inject(UtilityService);
  private router = inject(Router);

  isMobileMenuOpen = false;
  isScrolled = false;
  activeRoute = '/home';

  ngOnInit(): void {
    // Initial route set karo
    this.activeRoute = this.router.url;

    // Router events suno (back/forward bhi handle karega)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.urlAfterRedirects;
      });
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
}
