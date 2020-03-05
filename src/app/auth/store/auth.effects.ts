import {Actions, Effect, ofType} from '@ngrx/effects';

import {of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import * as AuthActions from './auth.actions';
import {Router} from '@angular/router';
import {UserModel} from '../user.model';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean
}

@Injectable()
export class AuthEffects {
  tokenExpirationTimer: any;

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    switchMap(() => {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));

      if (!userData || !userData._token) {
        return of();
      }

      const expirationDate = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDate);
      return of(new AuthActions.AuthSuccess({email: userData.email, userId: userData.id, token: userData._token,
        expirationDate: new Date(userData._tokenExpirationDate)}));
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => this.authRequest(authData))
  );

  @Effect()
  authSingUp = this.actions$.pipe(
    ofType(AuthActions.SING_UP),
    switchMap((authData: AuthActions.SingUp) => this.authRequest(authData))
  );

  autoLogout = (expirationDuration: number) => {
    return this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  };

  authRequest = (authData: AuthActions.LoginStart | AuthActions.SingUp) => {
    return this.http.post<AuthResponseData>(
      authData.url + environment.firebaseAPIKey,
      {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
      map(resData => {
        const expirationDate = new Date(new Date().getTime() + (+resData.expiresIn * 1000));
        const expirationTime = expirationDate.getTime() - new Date().getTime();
        this.autoLogout(expirationTime);
        return new AuthActions.AuthSuccess({email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate: expirationDate})
      }),
      catchError( err => {
        let errorMessage = 'An unknown error occurred!';
        if (err.error && err.error.error){
          switch(err.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'Email already exists';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'Invalid password';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'Email not found';
              break;
          }
        }

        return of(new AuthActions.AuthFailed(errorMessage));
      }))
  };

  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    tap((authData: AuthActions.AuthSuccess) => {
      const user = new UserModel(authData.payload.email, authData.payload.userId, authData.payload.token, authData.payload.expirationDate);
      localStorage.setItem('userData', JSON.stringify(user));
      this.router.navigate(['/'])
    })
  );

  @Effect({dispatch: false})
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');

      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {}
}
