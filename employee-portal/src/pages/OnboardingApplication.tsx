import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Alert, Box, Button, Paper, Snackbar, Step, StepLabel, Stepper } from '@mui/material';

import DocumentConfirmation from '../components/employee-info-forms/DocumentConfirmation';
import DriverAndCarInfoForm from '../components/employee-info-forms/DriverAndCarInfoForm';
import PersonalInfoForm from '../components/employee-info-forms/PersonalInfoForm';
import ReferenceAndEmergencyContactForm from '../components/employee-info-forms/ReferenceAndEmergencyContactForm';
import WorkAuthorizationForm from '../components/employee-info-forms/WorkAuthorizationForm';
import { useAppDispatch, useAppSelector } from '../store';
import { postOnboardingSubmission } from '../store/slices/employeeFormSlice';

interface OnboardingStep<T> {
  id: string;
  name: string;
  component?: FunctionComponent<T>;
  props?: T;
}

function FinishedStep() {
  return (
    <>
      <Alert severity="success">Your onboarding application is submitted!</Alert>
    </>
  );
}

function StepperFooter(props: {
  isFirst: boolean;
  isLast: boolean;
  nextDisabled: boolean;
  handleBack: () => void;
  handleNext: () => void;
}) {
  const { isFirst, isLast, handleBack, nextDisabled, handleNext } = props;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
      <Button color="inherit" disabled={isFirst} onClick={handleBack} sx={{ mr: 1 }}>
        Back
      </Button>
      <Box sx={{ flex: '1 1 auto' }} />
      <Button onClick={handleNext} disabled={nextDisabled}>
        {isLast ? 'Finish' : 'Next'}
      </Button>
    </Box>
  );
}
export default function OnBoardingApplicationPage() {
  const profilePictureRef = React.useRef<File | null>(null);
  const driverLicenseDocRef = React.useRef<File | null>(null);
  const f1OptDocRef = React.useRef<File | null>(null);

  const [forceCheckEnabled, setForceCheckEnabled] = React.useState(false);

  const [proceeding, setProceeding] = React.useState(false);

  const employeeOnboardingStatus = useAppSelector(
    (state) => state.employee.employee?.onboardingStatus
  );

  const employeeOnboardingFeedback = useAppSelector(
    (state) => state.employee.employee?.onboardingFeedback
  );

  const [formStatus, setFormStatus] = React.useState(true);

  const navigate = useNavigate();
  const [showStatusAlter, setShowStatusAlter] = useState(
    employeeOnboardingStatus === 'Pending' || employeeOnboardingStatus === 'Rejected'
  );
  const statusAlterText =
    employeeOnboardingStatus === 'Pending'
      ? 'Your application is pending. You can view the current application.'
      : `Your application is rejected: ${employeeOnboardingFeedback}. You can make a new submission.`;

  useEffect(() => {
    if (employeeOnboardingStatus === 'Approved') {
      navigate('/personal-info');
    }
  }, [employeeOnboardingStatus, navigate]);

  const readOnly = employeeOnboardingStatus === 'Pending';

  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const steps: OnboardingStep<any>[] = [
    {
      id: 'basicInfo',
      name: 'Personal Information',
      component: PersonalInfoForm,
      props: {
        onProfilePictureFileChange: (f: File) => (profilePictureRef.current = f),
        forceCheck: forceCheckEnabled,
        onFormStatusChange: setFormStatus,
        readOnly,
      },
    },
    {
      id: 'driverAndCarInfo',
      name: "Driver's License and Cars",
      component: DriverAndCarInfoForm,
      props: {
        onDriverLicenseFileChange: (f: File) => (driverLicenseDocRef.current = f),
        forceCheck: forceCheckEnabled,
        onFormStatusChange: setFormStatus,
        readOnly,
      },
    },
    {
      id: 'workAuth',
      name: 'Work Authorization',
      props: {
        onF1OptDocumentChange: (f: File) => (f1OptDocRef.current = f),
        forceCheck: forceCheckEnabled,
        onFormStatusChange: setFormStatus,
        readOnly,
      },
      component: WorkAuthorizationForm,
    },
    {
      id: 'contacts',
      name: 'Reference & Emergency Contacts',
      component: ReferenceAndEmergencyContactForm,
      props: {
        forceCheck: forceCheckEnabled,
        onFormStatusChange: setFormStatus,
        readOnly,
      },
    },
    { id: 'documents', name: 'Document Confirmation', component: DocumentConfirmation },
  ];

  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const finished = activeStepIndex == steps.length;

  const { component: StepComponent, props } = finished ? {} : steps[activeStepIndex];

  const nextDisabled = readOnly && activeStepIndex === steps.length - 1;

  React.useEffect(() => {
    if (forceCheckEnabled && proceeding) {
      if (formStatus) {
        setActiveStepIndex((prev) => prev + 1);
        setForceCheckEnabled(false);
        setFormStatus(true);
      }
      setProceeding(false);
    }
  }, [forceCheckEnabled, formStatus, proceeding]);

  React.useEffect(() => {
    if (finished) {
      dispatch(postOnboardingSubmission());
    }
  }, [activeStepIndex, dispatch, finished, steps.length]);

  const handleNext = () => {
    setForceCheckEnabled(true);
    setProceeding(true);
  };

  const handleBack = () => {
    setForceCheckEnabled(false);
    setActiveStepIndex((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={forceCheckEnabled && !formStatus}
        message="One or more fields are not filled correctly."
      />

      <Paper elevation={1} sx={{ width: '80%', margin: 'auto', padding: '2rem' }}>
        {showStatusAlter && (
          <Alert sx={{ mb: '3rem' }} severity="info" onClose={() => setShowStatusAlter(false)}>
            {statusAlterText}
          </Alert>
        )}
        {finished ? (
          <FinishedStep />
        ) : (
          <>
            <Stepper activeStep={activeStepIndex} alternativeLabel>
              {steps.map((step) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: React.ReactNode;
                } = {};
                return (
                  <Step key={step.id} {...stepProps}>
                    <StepLabel {...labelProps}>{step.name}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStepIndex === steps.length ? (
              <FinishedStep />
            ) : StepComponent ? (
              <StepComponent {...props} />
            ) : (
              <>Nothing to show yet!</>
            )}
            <StepperFooter
              isFirst={activeStepIndex == 0}
              isLast={activeStepIndex == steps.length - 1}
              handleBack={handleBack}
              handleNext={handleNext}
              nextDisabled={nextDisabled}
            />
          </>
        )}
      </Paper>
    </>
  );
}
