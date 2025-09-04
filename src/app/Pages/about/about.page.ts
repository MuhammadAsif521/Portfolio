import { Component, OnInit, AfterViewInit, ElementRef, inject } from '@angular/core';
import { FooterComponent } from "src/app/core/components/footer/footer.component";
import { ScrollAnimationService } from 'src/app/core/components/scroll-animation';
import { Stat } from 'src/app/core/interfaces/core.interface';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  imports: [FooterComponent]
})
export class AboutPage implements OnInit, AfterViewInit {
  private elementRef = inject(ElementRef);
  private scrollAnim = inject(ScrollAnimationService);

  stats: Stat[] = [
    { value: 15, suffix: '+', label: 'Projects Completed' },
    { value: 2, suffix: '+', label: 'Years Experience' },
    { value: 100, suffix: '%', label: 'Client Satisfaction' },
    { value: 24, suffix: '/7', label: 'Support Available' }
  ];
  ngAfterViewInit(): void {
    this.scrollAnim.observeFadeIn(this.elementRef);
  }
  ngOnInit(): void {}
}
