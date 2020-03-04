import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurd implements CanActivate {
  constructor(private store: Store<fromApp.AppState>, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree |  Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      take(1),
      map(authData => authData.user),
      map(user => {
        const isAuth = !!user;

        if (isAuth) {
          return isAuth;
        }

        return this.router.createUrlTree(['/auth']);
      }));

  }
}
