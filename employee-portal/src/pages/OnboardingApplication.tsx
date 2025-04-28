import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { Alert, Box, Button, Paper, Snackbar, Step, StepLabel, Stepper } from '@mui/material';

import AddressForm from '../components/employee-info-forms/AddressForm';
import BasicInfoForm from '../components/employee-info-forms/BasicInfoForm';
import DocumentConfirmation from '../components/employee-info-forms/DocumentConfirmation';
import DriverAndCarInfoForm from '../components/employee-info-forms/DriverAndCarInfoForm';
import PhoneContactForm from '../components/employee-info-forms/PhoneContactForm';
import WorkAuthorizationForm from '../components/employee-info-forms/WorkAuthorizationForm';
import EmergencyContactForm from '../components/employee-info-forms/contact-forms/EmergencyContactForm';
import ReferenceContactForm from '../components/employee-info-forms/contact-forms/ReferenceContactForm';
import useErrorMap from '../hooks/error-map/useErrorMap';
import { useAppDispatch, useAppSelector } from '../store';
import { postOnboardingSubmission } from '../store/slices/employeeFormSlice';

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

const steps = [
  {
    id: 'basicInfo',
    name: 'Personal Information',
  },
  {
    id: 'driverAndCarInfo',
    name: "Driver's License and Cars",
  },
  {
    id: 'workAuth',
    name: 'Work Authorization',
  },
  {
    id: 'contacts',
    name: 'Reference & Emergency Contacts',
  },
  { id: 'documents', name: 'Document Confirmation' },
];

export default function OnBoardingApplicationPage() {
  const profilePictureRef = useRef<File | null>(null);
  const driverLicenseDocRef = useRef<File | null>(null);
  const f1OptDocRef = useRef<File | null>(null);

  const [forceCheckEnabled, setForceCheckEnabled] = useState(false);
  const [proceeding, setProceeding] = useState(false);
  const [showErrorSnackBar, setShowErrorSnackBar] = useState(false);

  const { validateAll } = useErrorMap();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const employeeOnboardingStatus = useAppSelector(
    (state) => state.employee.employee?.onboardingStatus
  );

  const employeeOnboardingFeedback = useAppSelector(
    (state) => state.employee.employee?.onboardingFeedback
  );

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

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const finished = activeStepIndex == steps.length;
  const nextDisabled = readOnly && activeStepIndex === steps.length - 1;

  useEffect(() => {
    if (forceCheckEnabled && proceeding) {
      if (validateAll()) {
        setActiveStepIndex((prev) => prev + 1);
        setForceCheckEnabled(false);
      }
      setProceeding(false);
    }
  }, [forceCheckEnabled, proceeding, validateAll]);

  useEffect(() => {
    if (forceCheckEnabled && !validateAll()) {
      setShowErrorSnackBar(true);
    }
  }, [forceCheckEnabled, proceeding, validateAll]);

  useEffect(() => {
    if (finished) {
      dispatch(postOnboardingSubmission());
    }
  }, [activeStepIndex, dispatch, finished]);

  const handleNext = () => {
    setForceCheckEnabled(true);
    setProceeding(true);
  };

  const handleBack = () => {
    setForceCheckEnabled(false);
    setActiveStepIndex((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepComponent = () => {
    switch (activeStepIndex) {
      case 0:
        return (
          <>
            <BasicInfoForm
              onProfilePictureFileChange={(f: File) => (profilePictureRef.current = f)}
              readOnly={readOnly}
              forceCheck={forceCheckEnabled}
            />
            <AddressForm readOnly={readOnly} forceCheck={forceCheckEnabled} />
            <PhoneContactForm readOnly={readOnly} forceCheck={forceCheckEnabled} />
          </>
        );
      case 1:
        return (
          <DriverAndCarInfoForm
            onDriverLicenseFileChange={(f: File) => (driverLicenseDocRef.current = f)}
            readOnly={readOnly}
            forceCheck={forceCheckEnabled}
          />
        );
      case 2:
        return (
          <WorkAuthorizationForm
            onF1OptDocumentChange={(f: File) => (f1OptDocRef.current = f)}
            enableDocumentUpload={true}
            readOnly={readOnly}
            forceCheck={forceCheckEnabled}
          />
        );
      case 3:
        return (
          <>
            <ReferenceContactForm readOnly={readOnly} forceCheck={forceCheckEnabled} />
            <EmergencyContactForm readOnly={readOnly} forceCheck={forceCheckEnabled} />
          </>
        );
      case 4:
        return <DocumentConfirmation />;
      case 5:
        return <FinishedStep />;
      default:
        return 'Nothing to show!';
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showErrorSnackBar}
        autoHideDuration={5000}
        onClose={() => setShowErrorSnackBar(false)}
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
            {getStepComponent()}
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
