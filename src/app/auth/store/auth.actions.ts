import {Action} from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const AUTH_SUCCESS = '[Auth] Auth Success';
export const AUTH_FAILED = '[Auth] Auth Failed';
export const LOGOUT = '[Auth] Logout';
export const SING_UP = '[Auth] Sing Up';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthSuccess implements Action {
  readonly type = AUTH_SUCCESS;

  constructor(public payload: {email: string, userId: string, token: string, expirationDate: Date}) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  readonly url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';

  constructor(public payload: {email: string, password: string}) {}
}

export class AuthFailed implements Action {
  readonly type = AUTH_FAILED;

  constructor(public payload: string) {}
}

export class SingUp implements Action {
  readonly type = SING_UP;
  readonly url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';

  constructor(public payload: {email: string, password: string}) {}
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions = AuthSuccess | Logout | LoginStart | AuthFailed | SingUp | ClearError;
