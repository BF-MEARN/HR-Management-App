import { createAction, props } from '@ngrx/store';

import { RegistrationToken } from '../../interfaces/registration-token';

export const loadTokenHistory = createAction('[Token] Load History');

export const loadTokenHistorySuccess = createAction(
  '[Token] Load History Success',
  props<{ tokens: RegistrationToken[] }>()
);

export const addNewToken = createAction('[Token] Add New', props<{ token: RegistrationToken }>());
