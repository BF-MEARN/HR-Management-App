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

import useErrorMap from '../../hooks/error-map/useErrorMap';
import { useTextFieldProps } from '../../hooks/useTextFieldProps';
import { useAppDispatch, useAppSelector } from '../../store';
import { updatePersonalInfo } from '../../store/slices/employeeFormSlice';
import { Gender } from '../../store/slices/employeeFormTypes';
import { uploadEmployeeDocument } from '../../utils/utils';
import FileUploadWithPreview from '../FileUploadWithPreview';
import { EmployeeFormProps } from './formProps';

export type BasicInfoFormProps = EmployeeFormProps & {
  onProfilePictureFileChange: (f: File) => void;
};

function BasicInfoForm({ onProfilePictureFileChange, forceCheck, readOnly }: BasicInfoFormProps) {
  const formData = useAppSelector((state) => state.employeeForm.personalInfo);
  const userEmail = useAppSelector((state) => state.user.user?.email);
  const dispatch = useAppDispatch();
  const { updateErrorMap } = useErrorMap();

  useEffect(() => {
    if (!formData.email) {
      dispatch(updatePersonalInfo({ email: userEmail }));
    }
  }, [dispatch, formData.email, userEmail]);

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
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="h6" mb={1}>
            Name
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="First Name" {...firstNameProps} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Last Name" {...lastNameProps} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Middle Name" {...middleNameProps} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Preferred Name" {...preferredNameProps} />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="h6" mb={1}>
            Profile Picture
          </Typography>
          <FileUploadWithPreview
            previewURL={formData.profilePicture?.previewUrl}
            fileName={formData.profilePicture?.name}
            s3Key={formData.profilePicture?.s3Key}
            width="160px"
            height="160px"
            onFileSelect={async (f) => {
              onProfilePictureFileChange(f);

              const previewUrl = URL.createObjectURL(f); // <== Save it here first

              dispatch(
                updatePersonalInfo({
                  profilePicture: { name: f.name, previewUrl },
                })
              );

              try {
                const s3Key = await uploadEmployeeDocument(f, 'profilePictureFile'); // Uploads to backend and S3
                dispatch(
                  updatePersonalInfo({
                    profilePicture: { name: f.name, previewUrl, s3Key },
                  })
                );
              } catch (error) {
                console.error('Failed to upload profile picture:', error);
              }
            }}
            previewOnly={readOnly}
            buttonText="Upload Picture..."
            type="image"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4} mb={1}>
        Email
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Email"
            fullWidth
            value={formData.email ?? ''}
            slotProps={{ input: { disabled: true } }}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" mt={4} mb={1}>
        Identity
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField label="SSN (###-##-####)" placeholder="123-45-6789" {...ssnProps} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...dobProps}
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

export default BasicInfoForm;
