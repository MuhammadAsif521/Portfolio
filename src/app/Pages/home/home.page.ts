import { Component, OnInit, AfterViewInit, OnDestroy, inject, ElementRef } from '@angular/core';
import { ScrollAnimationService } from 'src/app/core/components/scroll-animation';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  private scrollAnim = inject(ScrollAnimationService);
  private elementRef = inject(ElementRef);
  isVisible = false;
  displayedText = '';
  showCursor = true;

  private fullText =
    "Developer specializing in Ionic, Angular, and modern web technologies. I build seamless, high-performance apps for Android, iOS, and Web.";
  private typewriterTimeout: any;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true;
      this.startTypewriter();
    }, 300);
  }

 ngAfterViewInit(): void {
    this.scrollAnim.observeFadeIn(this.elementRef);
  }

  ngOnDestroy(): void {
    if (this.typewriterTimeout) clearTimeout(this.typewriterTimeout);
  }

  private startTypewriter(): void {
    let index = 0;
    const typeSpeed = 50;

    const type = () => {
      if (index < this.fullText.length) {
        this.displayedText += this.fullText.charAt(index);
        index++;
        this.typewriterTimeout = setTimeout(type, typeSpeed);
      } else {
        setTimeout(() => (this.showCursor = false), 200);
      }
    };
    this.typewriterTimeout = setTimeout(type, 1000);
  }
}
