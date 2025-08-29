import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FooterComponent } from "src/app/core/components/footer/footer.component";

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [FooterComponent],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  isVisible = false;
  displayedText = '';
  showCursor = true;

  private fullText =
    'Full-Stack Mobile & Web Developer specializing in Ionic Angular and hybrid applications. I create seamless, cross-platform experiences that work beautifully on Android, iOS, and Web.';
  private typewriterTimeout: any;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true;
      this.startTypewriter();
    }, 500);
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
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
        // Hide cursor after blinking for 2s
        setTimeout(() => (this.showCursor = false), 200);
      }
    };

    this.typewriterTimeout = setTimeout(type, 1000);
  }

  private setupScrollAnimations(): void {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }
}
