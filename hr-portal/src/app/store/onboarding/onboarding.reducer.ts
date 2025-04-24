import { createReducer, on } from '@ngrx/store';
import { Employee } from 'src/app/interfaces/employee';

import * as OnboardingActions from './onboarding.actions';

export interface OnboardingState {
  pending: Employee[];
  approved: Employee[];
  rejected: Employee[];
  loading: boolean;
  error: any;
}

export const initialState: OnboardingState = {
  pending: [],
  approved: [],
  rejected: [],
  loading: false,
  error: null,
};

export const onboardingReducer = createReducer(
  initialState,

  // Pending
  on(OnboardingActions.loadPendingApplications, (state) => ({ ...state, loading: true })),
  on(OnboardingActions.loadPendingSuccess, (state, { applications }) => ({
    ...state,
    loading: false,
    pending: applications,
  })),
  on(OnboardingActions.loadPendingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),

  // Rejected
  on(OnboardingActions.loadRejectedApplications, (state) => ({ ...state, loading: true })),
  on(OnboardingActions.loadRejectedSuccess, (state, { applications }) => ({
    ...state,
    loading: false,
    rejected: applications,
  })),
  on(OnboardingActions.loadRejectedFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),

  // Approved
  on(OnboardingActions.loadApprovedApplications, (state) => ({ ...state, loading: true })),
  on(OnboardingActions.loadApprovedSuccess, (state, { applications }) => ({
    ...state,
    loading: false,
    approved: applications,
  })),
  on(OnboardingActions.loadApprovedFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  }))
);
