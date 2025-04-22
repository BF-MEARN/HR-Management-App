import { createReducer, on } from '@ngrx/store';

import { AuthActions, setUser } from './auth.actions';

export interface AuthState {
  user: any;
  isAuthenticated: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({
    ...state,
    user,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    error,
  })),
  on(AuthActions.logout, () => initialState)
);
