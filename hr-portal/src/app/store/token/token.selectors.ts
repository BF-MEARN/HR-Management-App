import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RegistrationToken } from '../../interfaces/registration-token';

export const selectTokenState = createFeatureSelector<RegistrationToken[]>('token');

export const selectAllTokens = createSelector(selectTokenState, (tokens) => tokens);
