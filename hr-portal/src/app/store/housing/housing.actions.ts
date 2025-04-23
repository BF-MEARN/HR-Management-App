import { createAction, props } from '@ngrx/store';
import { Housing } from 'src/app/interfaces/housing';

export const loadHouses = createAction('[Housing] Load Houses');
export const loadHousesSuccess = createAction(
  '[Housing] Load Houses Success',
  props<{ houses: Housing[] }>()
);
export const loadHousesFailure = createAction(
  '[Housing] Load Houses Failure',
  props<{ error: any }>()
);

export const addHouse = createAction('[Housing] Add House', props<{ house: Partial<Housing> }>());
export const addHouseSuccess = createAction('[Housing] Add House Success');
export const addHouseFailure = createAction('[Housing] Add House Failure', props<{ error: any }>());

export const deleteHouse = createAction('[Housing] Delete House', props<{ id: string }>());
export const deleteHouseSuccess = createAction('[Housing] Delete House Success');
export const deleteHouseFailure = createAction(
  '[Housing] Delete House Failure',
  props<{ error: any }>()
);
