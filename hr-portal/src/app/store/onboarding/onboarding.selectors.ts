import { createFeatureSelector, createSelector } from '@ngrx/store';

import { OnboardingState } from './onboarding.reducer';

export const selectOnboardingState = createFeatureSelector<OnboardingState>('onboarding');

export const selectPendingApplications = createSelector(
  selectOnboardingState,
  (state) => state.pending
);

export const selectApprovedApplications = createSelector(
  selectOnboardingState,
  (state) => state.approved
);

export const selectRejectedApplications = createSelector(
  selectOnboardingState,
  (state) => state.rejected
);

export const selectOnboardingLoading = createSelector(
  selectOnboardingState,
  (state) => state.loading
);
