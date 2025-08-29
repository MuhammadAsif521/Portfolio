import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [HeaderComponent, IonRouterOutlet],
})
export class LayoutComponent implements OnInit {
  public isLoading = signal<boolean>(false);
  private router = inject(Router);
  private windowWidth = signal<number>(window.innerWidth);
  constructor() {
    this.windowWidth.set(window.innerWidth);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      }
      if (event instanceof NavigationEnd) {
        const outlet = document.querySelector('ion-router-outlet');
        outlet?.classList.add('animate-in');
        setTimeout(() => outlet?.classList.remove('animate-in'), 150);
      }

      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => this.isLoading.set(false), 350);
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth.set(window.innerWidth);
  }
  ngOnInit() { }
  title = 'muhammad-asif-portfolio';

}
