import { createFeatureSelector, createSelector } from '@ngrx/store';

import { HousingState } from './housing.reducer';

export const selectHousingState = createFeatureSelector<HousingState>('housing');

export const selectAllHouses = createSelector(selectHousingState, (state) => state.houses);

export const selectHousingLoading = createSelector(selectHousingState, (state) => state.loading);

export const selectHousingError = createSelector(selectHousingState, (state) => state.error);
