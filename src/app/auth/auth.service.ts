import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {UserModel} from './user.model';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

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
  user = new BehaviorSubject<UserModel>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
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

    const loadedUser = new UserModel(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const exparationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(exparationDuration);
    }
  }

  logout() {
    this.user.next(null);
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
    this.user.next(user);
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
