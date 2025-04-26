import { useEffect } from 'react';

import { Box, Grid, TextField, Typography } from '@mui/material';

import useErrorMap from '../../contexts/error-map/useErrorMap';
import { useAppDispatch, useAppSelector } from '../../store';
import { updatePersonalInfo } from '../../store/slices/employeeFormSlice';
import { useTextFieldProps } from '../useTextFieldProps';
import { EmployeeFormProps } from './formProps';

export type AddressFormProps = EmployeeFormProps;

function AddressForm({ forceCheck, readOnly }: AddressFormProps) {
  const formData = useAppSelector((state) => state.employeeForm.personalInfo);
  const userEmail = useAppSelector((state) => state.user.user?.email);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!formData.email) {
      dispatch(updatePersonalInfo({ email: userEmail }));
    }
  }, [dispatch, formData.email, userEmail]);

  const { updateErrorMap } = useErrorMap();
  const streetProps = useTextFieldProps(
    {
      name: 'street',
      get: () => formData.address.street ?? '',
      set: (v) => dispatch(updatePersonalInfo({ address: { street: v } })),
      required: true,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const buildingProps = useTextFieldProps(
    {
      name: 'building',
      get: () => formData.address.building ?? '',
      set: (v) => dispatch(updatePersonalInfo({ address: { building: v } })),
      required: false,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const cityProps = useTextFieldProps(
    {
      name: 'city',
      get: () => formData.address.city ?? '',
      set: (v) => dispatch(updatePersonalInfo({ address: { city: v } })),
      required: true,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const stateProps = useTextFieldProps(
    {
      name: 'state',
      get: () => formData.address.state ?? '',
      set: (v) => dispatch(updatePersonalInfo({ address: { state: v } })),
      required: true,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const zipProps = useTextFieldProps(
    {
      name: 'zip',
      get: () => formData.address.zip ?? '',
      set: (v) => dispatch(updatePersonalInfo({ address: { zip: v } })),
      required: true,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  return (
    <Box component="form" noValidate sx={{ px: 2 }}>
      <Typography variant="h6" mt={4} mb={1}>
        Address
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Street" {...streetProps} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Building / Apt #" {...buildingProps} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="City" {...cityProps} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="State" {...stateProps} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="ZIP Code" {...zipProps} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddressForm;
