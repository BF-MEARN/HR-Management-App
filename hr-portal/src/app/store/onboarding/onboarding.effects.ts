import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { OnboardingApplicationService } from 'src/app/services/onboarding-application.service';

import * as OnboardingActions from './onboarding.actions';

@Injectable()
export class OnboardingEffects {
  constructor(
    private actions$: Actions,
    private onboardingService: OnboardingApplicationService
  ) {}

  loadPending$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadPendingApplications),
      mergeMap(() =>
        this.onboardingService.getPending().pipe(
          map((applications) =>
            OnboardingActions.loadPendingSuccess({
              applications: applications.filter(emp => emp.userId?.role === 'employee')
            })
          ),          
          catchError((error) => of(OnboardingActions.loadPendingFailure({ error })))
        )
      )
    )
  );

  loadRejected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadRejectedApplications),
      mergeMap(() =>
        this.onboardingService.getRejected().pipe(
          map((applications) =>
            OnboardingActions.loadRejectedSuccess({
              applications: applications.filter(emp => emp.userId?.role === 'employee')
            })
          ),        
          catchError((error) => of(OnboardingActions.loadRejectedFailure({ error })))
        )
      )
    )
  );

  loadApproved$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OnboardingActions.loadApprovedApplications),
      mergeMap(() =>
        this.onboardingService.getApproved().pipe(
          map((applications) =>
            OnboardingActions.loadApprovedSuccess({
              applications: applications.filter(emp => emp.userId?.role === 'employee')
            })
          ),        
          catchError((error) => of(OnboardingActions.loadApprovedFailure({ error })))
        )
      )
    )
  );
}
