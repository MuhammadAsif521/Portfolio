import { inject, Injectable, NgZone, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private router: Router = inject(Router);
  private navControl: NavController = inject(NavController);
  private modalController: ModalController = inject(ModalController);
  public popoverController: PopoverController = inject(PopoverController);

  // Network status signal
  public isOfflineSignal = signal(false);

  private ngZone = inject(NgZone);
  private networkListener: any;

  public navigateTo(link: string, replaceUrl: boolean = false): void {
    this.router.navigate([`/${link}`], { replaceUrl: replaceUrl });
  }

  public navigateToWithData(link: string, data: any, replaceUrl: boolean = false): void {
    this.router.navigate([`/${link}`], { state: { data }, replaceUrl: replaceUrl });
  }

  public navigateWithLastActivity(link: string, last: any): void {
    this.router.navigate([`/${link}`], { state: { last } });
  }

  public onBackPress(): void {
    this.navControl.back();
  }

  public async onPresentPopover(ev: Event, component: any): Promise<string> {
    const popover = await this.popoverController.create({
      component: component,
      event: ev,
      translucent: true,
      mode: 'ios'
    });
    await popover.present();

    return (await popover.onDidDismiss()).data as string;
  }

  public async onPresentModal<T>(component: any, cls: string = '', data: any = undefined, backDropDismiss: boolean = false, breakpoints?: number[], initialBreakpoint?: number): Promise<T> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: component,
      cssClass: cls,
      componentProps: {
        data: data
      },
      backdropDismiss: backDropDismiss,
      breakpoints: breakpoints,
      initialBreakpoint: initialBreakpoint
    });
    await modal.present();
    const { data: result } = await modal.onDidDismiss();
    return result;
  }

  public async openCustomModal(component: any, cls?: string): Promise<any> {
    const modal: HTMLIonModalElement = await this.modalController.create({
      component: component,
      cssClass: cls ?? ''
    });
    await modal.present();
    return (await modal.onDidDismiss()).data;
  }

  public isMobileScreen(): boolean {
    return window.innerWidth < 600;
  }

  public isMidScreen(): boolean {
    return window.innerWidth >= 600 && window.innerWidth <= 1300;
  }

  public isDesktop(): boolean {
    return window.innerWidth > 1300;
  }

  truncateName(name: string): string {
    let maxLength: number;

    if (this.isMobileScreen()) {
      maxLength = 20;
    } else {
      maxLength = 50; // for tablet and desktop
    }

    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  }
}