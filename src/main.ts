import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withViewTransitions } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { register } from 'swiper/element/bundle';

import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ApplicationRef } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

register();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules), withViewTransitions()),
  ],
})
  .then(appRef => {
    const loader = document.getElementById('global-loader');
    if (!loader) return;

    try {
      const applicationRef = appRef.injector.get(ApplicationRef);
      // wait until Angular is stable
      firstValueFrom(applicationRef.isStable.pipe(filter(stable => stable)))
        .then(() => {
          loader.classList.add('fade-out');
        });
    } catch {
      loader.remove();
    }
  })
  .catch(err => {
    const loader = document.getElementById('global-loader');
    if (loader) loader.remove();
    console.error(err);
  });
