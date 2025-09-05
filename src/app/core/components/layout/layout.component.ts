import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { routeFadeAnimation } from '../animations';
import { AsyncPipe } from '@angular/common';
import { NetworkService } from '../../Services/network.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [HeaderComponent, RouterOutlet, FooterComponent, AsyncPipe],
  animations: [routeFadeAnimation],
  standalone: true,
})
export class LayoutComponent {
  constructor(public network: NetworkService) { }

  getAnimationData(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
