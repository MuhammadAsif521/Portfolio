// services/scroll.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  
  constructor() {}

  scrollToSection(sectionId: string, offset: number = 80): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  getScrollPercentage(): number {
    const scrollHeight = document.body.scrollHeight;
    const scrollTop = window.pageYOffset;
    const clientHeight = window.innerHeight;
    return (scrollTop / (scrollHeight - clientHeight)) * 100;
  }
}
