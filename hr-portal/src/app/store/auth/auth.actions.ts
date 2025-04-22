import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ username: string; password: string }>(),
    'Login Success': props<{ user: any }>(),
    'Login Failure': props<{ error: string }>(),
    Logout: emptyProps(),
  },
});

export const setUser = createAction('[Auth] Set User', props<{ user: any }>());
