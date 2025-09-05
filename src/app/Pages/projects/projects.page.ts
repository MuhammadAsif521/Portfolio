import { Component, AfterViewInit, ElementRef, inject } from '@angular/core';
import { ProjectCardsComponent } from "src/app/core/components/project-cards/project-cards.component";
import { ScrollAnimationService } from 'src/app/core/components/scroll-animation';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  imports: [ProjectCardsComponent],
})
export class ProjectsPage implements AfterViewInit {
  private elementRef = inject(ElementRef);
  private scrollAnim = inject(ScrollAnimationService);

  activeFilter: string = 'all';

  ngAfterViewInit(): void {
    this.scrollAnim.observeFadeIn(this.elementRef);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    setTimeout(() => {
      this.scrollAnim.observeFadeIn(this.elementRef);
    }, 100);
  }
}
