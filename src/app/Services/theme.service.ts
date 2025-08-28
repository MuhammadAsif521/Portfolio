import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor() {
    // Check if dark mode was previously enabled
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.darkMode = JSON.parse(savedTheme);
      this.setTheme(this.darkMode);
    }
  }

  isDarkMode() {
    return this.darkMode;
  }

  setTheme(isDark: boolean) {
    this.darkMode = isDark;
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }

  toggleTheme() {
    this.setTheme(!this.darkMode);
  }
}