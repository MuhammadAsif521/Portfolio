import { inject, Injectable, NgZone, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private router: Router = inject(Router);

  public navigateTo(link: string, replaceUrl: boolean = false): void {
    this.router.navigate([`/${link}`], { replaceUrl: replaceUrl });
  }

  public navigateToWithData(link: string, data: any, replaceUrl: boolean = false): void {
    this.router.navigate([`/${link}`], { state: { data }, replaceUrl: replaceUrl });
  }

  public navigateWithLastActivity(link: string, last: any): void {
    this.router.navigate([`/${link}`], { state: { last } });
  }
}