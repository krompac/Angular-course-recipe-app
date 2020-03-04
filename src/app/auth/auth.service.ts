import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {UserModel} from './user.model';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {
  }


  singUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
    ).pipe(catchError(this.handleError), tap(data => {
          this.handleUser(data);
      }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).pipe(catchError(this.handleError), tap(data => {
      this.handleUser(data);
    }));
  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    if (userData._token) {
      this.store.dispatch(new AuthActions.Login({email: userData.email, userId: userData.id, token: userData._token,
        expirationDate: new Date(userData._tokenExpirationDate)}));
      const expirationDate = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDate);
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleUser(data: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime() + (+data.expiresIn * 1000));
    const user = new UserModel(data.email, data.localId, data.idToken, expirationDate);
    this.store.dispatch(new AuthActions.Login({email: data.email, userId: data.localId, token: data.idToken, expirationDate: expirationDate}));
    this.autoLogout(+data.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (errorRes.error && errorRes.error.error){
      switch(errorRes.error.error.message) {
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

    return throwError(errorMessage);
  }
}
