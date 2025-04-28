import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HousingManagementService } from 'src/app/services/housing-management.service';
import * as HousingActions from './housing.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class HousingEffects {
  constructor(
    private actions$: Actions,
    private housingService: HousingManagementService
  ) {}

  loadHouses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HousingActions.loadHouses),
      mergeMap(() =>
        this.housingService.getAllHouses().pipe(
          map((houses) => HousingActions.loadHousesSuccess({ houses })),
          catchError((error) =>
            of(HousingActions.loadHousesFailure({ error }))
          )
        )
      )
    )
  );

  deleteHouse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HousingActions.deleteHouse),
      mergeMap(({ id }) =>
        this.housingService.deleteHouse(id).pipe(
          map(() => HousingActions.deleteHouseSuccess({ id })),
          catchError((error) => of(HousingActions.deleteHouseFailure({ error })))
        )
      )
    )
  );
  
}
