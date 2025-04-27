import { createReducer, on } from '@ngrx/store';
import { Housing } from 'src/app/interfaces/housing';

import * as HousingActions from './housing.actions';

export interface HousingState {
  houses: Housing[];
  loading: boolean;
  error: any;
}

export const initialState: HousingState = {
  houses: [],
  loading: false,
  error: null,
};

export const housingReducer = createReducer(
  initialState,

  on(HousingActions.loadHouses, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HousingActions.loadHousesSuccess, (state, { houses }) => ({
    ...state,
    houses,
    loading: false,
  })),

  on(HousingActions.loadHousesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(HousingActions.deleteHouse, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(HousingActions.deleteHouseSuccess, (state, { id }) => ({
    ...state,
    houses: state.houses.filter((house) => house._id !== id),
    loading: false,
    error: null,
  })),

  on(HousingActions.deleteHouseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
