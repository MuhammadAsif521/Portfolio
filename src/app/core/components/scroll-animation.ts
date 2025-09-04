// src/app/core/services/scroll-animation.service.ts
import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private observer: IntersectionObserver;

  constructor() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // callback trigger agar set hai
          const callback = (entry.target as any).__onVisibleCallback;
          if (callback) {
            callback(entry.target);
          }

          this.observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  }

  /**
   * Observe fade-in elements (with optional per-element callback)
   */
  observeFadeIn(elementRef: ElementRef, onVisible?: (el: Element) => void): void {
    const fadeElements = elementRef.nativeElement.querySelectorAll('.fade-in');
    fadeElements.forEach((el: Element) => {
      if (onVisible) {
        (el as any).__onVisibleCallback = onVisible;
      }
      this.observer.observe(el);
    });
  }
}
