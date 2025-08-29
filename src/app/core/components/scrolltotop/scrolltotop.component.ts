// scroll-to-top.component.ts
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll',
  templateUrl: './scrolltotop.component.html',
  styleUrls: ['./scrolltotop.component.scss']
})
export class ScrollToTopComponent {
  isVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Show button after scrolling 40% of page height
    const scrollHeight = document.body.scrollHeight;
    const scrollTop = window.pageYOffset;
    const clientHeight = window.innerHeight;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    this.isVisible = scrollPercentage > 40;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}