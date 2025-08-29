// services/theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(true);
  public isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {}

  get currentTheme(): string {
    return this.isDarkTheme.value ? 'dark' : 'light';
  }

  get isLight(): boolean {
    return !this.isDarkTheme.value;
  }

  get isDark(): boolean {
    return this.isDarkTheme.value;
  }

  initTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme.next(savedTheme === 'dark');
    } else {
      // Default to dark theme
      this.isDarkTheme.next(true);
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkTheme.value;
    this.isDarkTheme.next(newTheme);
    this.saveTheme();
    this.applyTheme();
  }

  setTheme(isDark: boolean): void {
    this.isDarkTheme.next(isDark);
    this.saveTheme();
    this.applyTheme();
  }

  private saveTheme(): void {
    const theme = this.isDarkTheme.value ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  }

  private applyTheme(): void {
    const theme = this.isDarkTheme.value ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }
}

