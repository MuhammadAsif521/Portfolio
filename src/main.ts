import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withViewTransitions } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { register } from 'swiper/element/bundle';

import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from './environments/environment';
import { ApplicationRef } from '@angular/core';

register();

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideAnimations(),
    provideRouter(routes, withPreloading(PreloadAllModules), withViewTransitions()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
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
          setTimeout(() => loader.remove(), 320);
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
