import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TokenService } from '../../services/token.service'; // ✅ fixed
import { addNewToken, loadTokenHistory, loadTokenHistorySuccess } from './token.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable()
export class TokenEffects {
  constructor(private actions$: Actions, private tokenService: TokenService) {}

  loadTokenHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTokenHistory),
      switchMap(() =>
        this.tokenService.getTokenHistory().pipe(
          map((tokens) => loadTokenHistorySuccess({ tokens })),
          catchError(() => EMPTY)
        )
      )
    )
  );
}