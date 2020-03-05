import {UserModel} from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: UserModel,
  authError: string,
  loading: boolean
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
};

export function authReducer(state: State = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.AUTH_SUCCESS:
      const user = new UserModel(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate);
      return {
        ...state,
        authError: null,
        user: user,
        loading: false
      };

    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };

    case AuthActions.SING_UP:
    case AuthActions.LOGIN_START:
      return {
        ...state,
        authError: null,
        loading: true
      };

    case AuthActions.AUTH_FAILED:
      return {
        ...state,
        authError: action.payload,
        loading: false
      };

    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };

    default:
      return state;
  }
}
