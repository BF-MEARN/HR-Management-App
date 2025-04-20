import React, { ComponentType } from 'react';

import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';

import DriverAndCarInfoForm from '../components/employee-info-forms/DriverAndCarInfoForm';
import PersonalInfoForm from '../components/employee-info-forms/PersonalInfoForm';
import WorkAuthorizationForm from '../components/employee-info-forms/WorkAuthorizationForm';

interface OnboardingStep<T> {
  id: string;
  name: string;
  component?: ComponentType<T>;
  props?: T;
  skippable?: boolean;
}

const testEmail = 'abc@xyz.com';

function FinishedStep() {
  return (
    <>
      <Typography sx={{ mt: 2, mb: 1 }}>All steps completed!</Typography>
    </>
  );
}

function StepperFooter(props: {
  isFirst: boolean;
  isSkippable: boolean;
  isLast: boolean;
  handleBack: () => void;
  handleSkip: () => void;
  handleNext: () => void;
}) {
  const { isFirst, isSkippable, isLast, handleBack, handleSkip, handleNext } = props;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
      <Button color="inherit" disabled={isFirst} onClick={handleBack} sx={{ mr: 1 }}>
        Back
      </Button>
      <Box sx={{ flex: '1 1 auto' }} />
      {isSkippable && (
        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
          Skip
        </Button>
      )}
      <Button onClick={handleNext}>{isLast ? 'Finish' : 'Next'}</Button>
    </Box>
  );
}

export default function OnBoardingApplicationPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const steps: OnboardingStep<any>[] = [
    {
      id: 'basicInfo',
      name: 'Personal Information',
      component: PersonalInfoForm,
      props: { email: testEmail },
    },
    {
      id: 'driverAndCarInfo',
      name: "Driver's License and Cars",
      component: DriverAndCarInfoForm,
      skippable: true,
    },
    {
      id: 'workAuth',
      name: 'Work Authorization',
      component: WorkAuthorizationForm,
    },
    {
      id: 'contacts',
      name: 'Reference & Emergency Contacts',
    },
    { id: 'documents', name: 'Documents Review' },
  ];

  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const finished = activeStepIndex == steps.length;

  const activeStep = steps[activeStepIndex];
  const { component: StepComponent, props } = activeStep;

  const isStepSkipped = (index: number) => {
    return skipped.has(index);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (activeStep.skippable) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStepIndex);
    }

    setActiveStepIndex((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStepIndex((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!activeStep.skippable) {
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStepIndex((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStepIndex);
      return newSkipped;
    });
  };

  return (
    <Paper elevation={1} sx={{ width: '60%', margin: 'auto', padding: '2rem' }}>
      {finished ? (
        <FinishedStep />
      ) : (
        <>
          <Stepper activeStep={activeStepIndex}>
            {steps.map((step, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              if (step.skippable) {
                labelProps.optional = <Typography variant="caption">Optional</Typography>;
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
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
            isSkippable={steps[activeStepIndex].skippable === true}
            handleBack={handleBack}
            handleSkip={handleSkip}
            handleNext={handleNext}
          />
        </>
      )}
    </Paper>
  );
}
