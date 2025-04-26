import { useEffect } from 'react';

import { Box, Grid, TextField, Typography } from '@mui/material';

import useErrorMap from '../../contexts/error-map/useErrorMap';
import { useAppDispatch, useAppSelector } from '../../store';
import { updatePersonalInfo } from '../../store/slices/employeeFormSlice';
import { useTextFieldProps } from '../useTextFieldProps';
import { EmployeeFormProps } from './formProps';

export type PhoneContactFormProps = EmployeeFormProps;

function PhoneContactForm({ forceCheck, readOnly }: PhoneContactFormProps) {
  const formData = useAppSelector((state) => state.employeeForm.personalInfo);
  const userEmail = useAppSelector((state) => state.user.user?.email);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!formData.email) {
      dispatch(updatePersonalInfo({ email: userEmail }));
    }
  }, [dispatch, formData.email, userEmail]);

  const { updateErrorMap } = useErrorMap();
  const cellPhoneProps = useTextFieldProps(
    {
      name: 'cellPhone',
      get: () => formData.cellPhone ?? '',
      set: (v) => dispatch(updatePersonalInfo({ cellPhone: v })),
      required: true,
      type: 'phone',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const workPhoneProps = useTextFieldProps(
    {
      name: 'workPhone',
      get: () => formData.workPhone ?? '',
      set: (v) => dispatch(updatePersonalInfo({ workPhone: v })),
      required: false,
      type: 'phone',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  return (
    <Box component="form" noValidate sx={{ px: 2 }}>
      <Typography variant="h6" mt={4} mb={1}>
        Contact
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Cell Phone" {...cellPhoneProps()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Work Phone" {...workPhoneProps()} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PhoneContactForm;
