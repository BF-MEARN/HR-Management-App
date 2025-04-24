import { createAction, props } from '@ngrx/store';
import { Employee } from 'src/app/interfaces/employee';

// Pending
export const loadPendingApplications = createAction('[Onboarding] Load Pending Applications');
export const loadPendingSuccess = createAction(
  '[Onboarding] Load Pending Applications Success',
  props<{ applications: Employee[] }>()
);
export const loadPendingFailure = createAction(
  '[Onboarding] Load Pending Applications Failure',
  props<{ error: any }>()
);

// Rejected
export const loadRejectedApplications = createAction('[Onboarding] Load Rejected Applications');
export const loadRejectedSuccess = createAction(
  '[Onboarding] Load Rejected Applications Success',
  props<{ applications: Employee[] }>()
);
export const loadRejectedFailure = createAction(
  '[Onboarding] Load Rejected Applications Failure',
  props<{ error: any }>()
);

// Approved
export const loadApprovedApplications = createAction('[Onboarding] Load Approved Applications');
export const loadApprovedSuccess = createAction(
  '[Onboarding] Load Approved Applications Success',
  props<{ applications: Employee[] }>()
);
export const loadApprovedFailure = createAction(
  '[Onboarding] Load Approved Applications Failure',
  props<{ error: any }>()
);
