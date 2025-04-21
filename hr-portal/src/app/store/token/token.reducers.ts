import { createReducer, on } from '@ngrx/store';

import { RegistrationToken } from '../../interfaces/registration-token';
import { addNewToken, loadTokenHistorySuccess } from './token.actions';

export const initialState: RegistrationToken[] = [];

export const tokenReducer = createReducer(
  initialState,
  on(loadTokenHistorySuccess, (_, { tokens }) => [...tokens]),
  on(addNewToken, (state, { token }) => [token, ...state])
);
