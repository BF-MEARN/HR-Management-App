import React from 'react';

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

import FileUploadWithPreview from '../FileUploadWithPreview';

export interface PersonalInfoFormData {
  // Names
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;

  // Contact
  cellPhone: string;
  workPhone?: string;
  email: string; // pre-filled, read-only

  // Address
  address: {
    building?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  // Profile
  profilePicture?: File | string; // string if already uploaded

  // Identity
  ssn: string; // ###-##-####
  dob: string; // ISO string or Date
  gender: 'male' | 'female' | 'prefer_not_to_say';
}

export interface AuthFormData {
  username: string;
  email: string;
  password: string;
}

export interface PersonalInfoFormProps {
  email: string;
  initFormData?: PersonalInfoFormData;
}

export default function PersonalInfoForm(props: PersonalInfoFormProps) {
  const { email, initFormData } = props;
  const [formData, setFormData] = React.useState<PersonalInfoFormData>(
    initFormData ?? {
      firstName: '',
      lastName: '',
      middleName: '',
      preferredName: '',
      cellPhone: '',
      workPhone: '',
      email,
      address: {
        building: '',
        street: '',
        city: '',
        state: '',
        zip: '',
      },

      profilePicture: '',
      ssn: '',
      dob: '',
      gender: 'prefer_not_to_say',
    }
  );

  const updateField = (key: keyof PersonalInfoFormData, value: string) => {
    if (key != 'profilePicture' && key != 'address' && key != 'email') {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const updateProfilePicture = (value: string | File) => {
    setFormData((prev) => ({ ...prev, profilePicture: value }));
  };

  const updateAddressField = (key: keyof PersonalInfoFormData['address'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }));
  };
  return (
    <Box component="form" noValidate sx={{ px: 2 }}>
      {/* Section: Name */}
      <Typography variant="h6" mb={1}>
        Personal Info
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="First Name"
            required
            fullWidth
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Last Name"
            required
            fullWidth
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Middle Name"
            fullWidth
            value={formData.middleName}
            onChange={(e) => updateField('middleName', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Preferred Name"
            fullWidth
            value={formData.preferredName}
            onChange={(e) => updateField('preferredName', e.target.value)}
          />
        </Grid>
      </Grid>
      {/* Section: Picture */}
      <Typography variant="h6" mt={4} mb={1}>
        Profile Picture
      </Typography>
      <FileUploadWithPreview
        file={formData.profilePicture}
        onFileSelect={(f) => updateProfilePicture(f)}
        buttonText="Upload Picture..."
        type="image"
      />
      {/* Section: Contact */}
      <Typography variant="h6" mt={4} mb={1}>
        Contact
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Cell Phone"
            required
            fullWidth
            value={formData.cellPhone}
            onChange={(e) => updateField('cellPhone', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Work Phone"
            fullWidth
            value={formData.workPhone}
            onChange={(e) => updateField('workPhone', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Email"
            fullWidth
            value={formData.email}
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
      </Grid>

      {/* Section: Address */}
      <Typography variant="h6" mt={4} mb={1}>
        Address
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Street"
            required
            fullWidth
            value={formData.address.street}
            onChange={(e) => updateAddressField('street', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Building / Apt #"
            fullWidth
            value={formData.address.building}
            onChange={(e) => updateAddressField('building', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="City"
            required
            fullWidth
            value={formData.address.city}
            onChange={(e) => updateAddressField('city', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="State"
            required
            fullWidth
            value={formData.address.state}
            onChange={(e) => updateAddressField('state', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="ZIP Code"
            required
            fullWidth
            value={formData.address.zip}
            onChange={(e) => updateAddressField('zip', e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Section: Identity */}
      <Typography variant="h6" mt={4} mb={1}>
        Identity
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="SSN (###-##-####)"
            required
            fullWidth
            value={formData.ssn}
            onChange={(e) => updateField('ssn', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date of Birth"
            type="date"
            required
            fullWidth
            value={formData.dob}
            onChange={(e) => updateField('dob', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={formData.gender}
              label="Gender"
              onChange={(e) => updateField('gender', e.target.value)}
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
