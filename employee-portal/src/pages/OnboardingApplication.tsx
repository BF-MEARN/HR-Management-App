import React, { FunctionComponent } from 'react';

import { Box, Button, Paper, Snackbar, Step, StepLabel, Stepper, Typography } from '@mui/material';

import DocumentConfirmation from '../components/employee-info-forms/DocumentConfirmation';
import DriverAndCarInfoForm from '../components/employee-info-forms/DriverAndCarInfoForm';
import PersonalInfoForm from '../components/employee-info-forms/PersonalInfoForm';
import ReferenceAndEmergencyContactForm from '../components/employee-info-forms/ReferenceAndEmergencyContactForm';
import WorkAuthorizationForm from '../components/employee-info-forms/WorkAuthorizationForm';
import { useAppDispatch } from '../store';
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
      <Typography sx={{ mt: 2, mb: 1 }}>All steps completed!</Typography>
    </>
  );
}

function StepperFooter(props: {
  isFirst: boolean;
  isLast: boolean;
  handleBack: () => void;
  handleNext: () => void;
}) {
  const { isFirst, isLast, handleBack, handleNext } = props;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
      <Button color="inherit" disabled={isFirst} onClick={handleBack} sx={{ mr: 1 }}>
        Back
      </Button>
      <Box sx={{ flex: '1 1 auto' }} />
      <Button onClick={handleNext}>{isLast ? 'Finish' : 'Next'}</Button>
    </Box>
  );
}
export default function OnBoardingApplicationPage() {
  const profilePictureRef = React.useRef<File | null>(null);
  const driverLicenseDocRef = React.useRef<File | null>(null);
  const f1OptDocRef = React.useRef<File | null>(null);

  const [forceCheckEnabled, setForceCheckEnabled] = React.useState(false);
  const [formStatus, setFormStatus] = React.useState(false);
  const [proceeding, setProceeding] = React.useState(false);
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
      },
    },
    {
      id: 'workAuth',
      name: 'Work Authorization',
      props: {
        onF1OptDocumentChange: (f: File) => (f1OptDocRef.current = f),
        forceCheck: forceCheckEnabled,
        onFormStatusChange: setFormStatus,
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
      },
    },
    { id: 'documents', name: 'Document Confirmation', component: DocumentConfirmation },
  ];

  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const finished = activeStepIndex == steps.length;

  const { component: StepComponent, props } = finished ? {} : steps[activeStepIndex];

  React.useEffect(() => {
    if (forceCheckEnabled && proceeding) {
      if (formStatus) {
        setActiveStepIndex((prev) => prev + 1);
        setForceCheckEnabled(false);
      }
    }
    setProceeding(false);
  }, [forceCheckEnabled, formStatus, proceeding]);

  React.useEffect(() => {
    if (activeStepIndex === steps.length) {
      dispatch(postOnboardingSubmission());
    }
    setProceeding(false);
  }, [activeStepIndex, dispatch, steps.length]);

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
            />
          </>
        )}
      </Paper>
    </>
  );
}
