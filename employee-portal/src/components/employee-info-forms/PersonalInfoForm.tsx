import { useEffect } from 'react';

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../store';
import { updatePersonalInfo } from '../../store/slices/employeeFormSlice';
import { Gender } from '../../store/slices/employeeFormTypes';
import FileUploadWithPreview from '../FileUploadWithPreview';
import { useErrorMap, useTextFieldProps } from '../useTextFieldProps';
import { EmployeeFormProps } from './formProps';

export type PersonalInfoFormProps = EmployeeFormProps & {
  onProfilePictureFileChange: (f: File) => void;
};

function PersonalInfoForm({
  onProfilePictureFileChange,
  onFormStatusChange,
  forceCheck,
  readOnly,
}: PersonalInfoFormProps) {
  const formData = useAppSelector((state) => state.employeeForm.personalInfo);
  const userEmail = useAppSelector((state) => state.user.user?.email);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!formData.email) {
      dispatch(updatePersonalInfo({ email: userEmail }));
    }
  }, [dispatch, formData.email, userEmail]);

  const updateErrorMap = useErrorMap(onFormStatusChange);
  const firstNameProps = useTextFieldProps(
    {
      name: 'firstName',
      get: () => formData.firstName ?? '',
      set: (v) => dispatch(updatePersonalInfo({ firstName: v })),
      required: true,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const lastNameProps = useTextFieldProps(
    {
      name: 'lastName',
      get: () => formData.lastName ?? '',
      set: (v) => dispatch(updatePersonalInfo({ lastName: v })),
      required: true,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const middleNameProps = useTextFieldProps(
    {
      name: 'middleName',
      get: () => formData.middleName ?? '',
      set: (v) => dispatch(updatePersonalInfo({ middleName: v })),
      required: false,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const preferredNameProps = useTextFieldProps(
    {
      name: 'preferredName',
      get: () => formData.preferredName ?? '',
      set: (v) => dispatch(updatePersonalInfo({ preferredName: v })),
      required: false,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

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

  const ssnProps = useTextFieldProps(
    {
      name: 'ssn',
      get: () => formData.ssn ?? '',
      set: (v) => dispatch(updatePersonalInfo({ ssn: v })),
      required: true,
      type: 'ssn',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const dobProps = useTextFieldProps(
    {
      name: 'dob',
      get: () => formData.dob ?? '',
      set: (v) => dispatch(updatePersonalInfo({ dob: v })),
      required: true,
      type: 'date',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  return (
    <Box component="form" noValidate sx={{ px: 2 }}>
      {/* Section: Name */}
      <Typography variant="h6" mb={1}>
        Personal Info
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="First Name" {...firstNameProps()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Last Name" {...lastNameProps()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Middle Name" {...middleNameProps()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Preferred Name" {...preferredNameProps()} />
        </Grid>
      </Grid>
      {/* Section: Picture */}
      <Typography variant="h6" mt={4} mb={1}>
        Profile Picture
      </Typography>
      <FileUploadWithPreview
        previewURL={formData.profilePicture?.url ?? ''}
        fileName={formData.profilePicture?.name ?? ''}
        width="200px"
        height="200px"
        onFileSelect={(f) => {
          onProfilePictureFileChange(f);
          dispatch(
            updatePersonalInfo({
              profilePicture: { name: f.name, url: URL.createObjectURL(f) },
            })
          );
        }}
        previewOnly={readOnly}
        buttonText="Upload Picture..."
        type="image"
      />
      {/* Section: Contact */}
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
        <Grid size={{ xs: 12 }}>
          {/* Cannot be modified */}
          <TextField
            label="Email"
            fullWidth
            value={formData.email ?? ''}
            slotProps={{ input: { disabled: true } }}
          />
        </Grid>
      </Grid>

      {/* Section: Address */}
      <Typography variant="h6" mt={4} mb={1}>
        Address
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Street" {...streetProps()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Building / Apt #" {...buildingProps()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="City" {...cityProps()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="State" {...stateProps()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField label="ZIP Code" {...zipProps()} />
        </Grid>
      </Grid>

      {/* Section: Identity */}
      <Typography variant="h6" mt={4} mb={1}>
        Identity
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField label="SSN (###-##-####)" placeholder="123-45-6789" {...ssnProps()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date of Birth"
            type="date"
            {...dobProps({
              slotProps: { inputLabel: { shrink: true } },
            })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={formData.gender}
              label="Gender"
              disabled={readOnly}
              onChange={(e) => dispatch(updatePersonalInfo({ gender: e.target.value as Gender }))}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PersonalInfoForm;
