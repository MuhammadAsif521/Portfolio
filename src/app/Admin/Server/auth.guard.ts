import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private firebaseService: FirebaseService = inject(FirebaseService);
    private router: Router =inject(Router);
  canActivate(): Observable<boolean> {
    return this.firebaseService.isAuthenticated().pipe(
      take(1),
      map(authenticated => {
        if (!authenticated) {
          this.router.navigate(['/admin/login']);
          return false;
        }
        return true;
      })
    );
  }
}
