import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  private _online$ = new BehaviorSubject<boolean>(navigator.onLine);
  public online$ = this._online$.asObservable();

  private pingUrl = '/assets/ping.json';
  private readonly TIMEOUT = 5000;

  constructor(private ngZone: NgZone) {
    this.setupListeners();
    // immediate check
    this.checkAndUpdate();
  }

  private setupListeners() {
    window.addEventListener('online', () => this.ngZone.run(() => this.checkAndUpdate()));
    window.addEventListener('offline', () => this.ngZone.run(() => this._online$.next(false)));
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.ngZone.run(() => this.checkAndUpdate());
    });
  }

  private async checkAndUpdate() {
    const ok = await this.checkInternet();
    this._online$.next(ok);
  }

  public async checkInternet(): Promise<boolean> {
    if (!navigator.onLine) return false;
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), this.TIMEOUT);
      // add timestamp to bypass caching
      const res = await fetch(`${this.pingUrl}?t=${Date.now()}`, { cache: 'no-store', signal: controller.signal });
      clearTimeout(id);
      return res.ok;
    } catch {
      return false;
    }
  }

  // explicit refresh if needed from UI
  public refresh() { this.checkAndUpdate(); }
}
