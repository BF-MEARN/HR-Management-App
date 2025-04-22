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

export interface PersonalInfoFormProps {
  onProfilePictureFileChange: (f: File) => void;
}

export default function PersonalInfoForm({ onProfilePictureFileChange }: PersonalInfoFormProps) {
  const formData = useAppSelector((state) => state.employeeForm.personalInfo);
  const dispatch = useAppDispatch();

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
            onChange={(e) => dispatch(updatePersonalInfo({ firstName: e.target.value }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Last Name"
            required
            fullWidth
            value={formData.lastName}
            onChange={(e) => dispatch(updatePersonalInfo({ lastName: e.target.value }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Middle Name"
            fullWidth
            value={formData.middleName}
            onChange={(e) => dispatch(updatePersonalInfo({ middleName: e.target.value }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Preferred Name"
            fullWidth
            value={formData.preferredName}
            onChange={(e) => dispatch(updatePersonalInfo({ preferredName: e.target.value }))}
          />
        </Grid>
      </Grid>
      {/* Section: Picture */}
      <Typography variant="h6" mt={4} mb={1}>
        Profile Picture
      </Typography>
      <FileUploadWithPreview
        previewURL={formData.profilePicturePreview}
        fileName={formData.profilePictureFileName}
        onFileSelect={(f) => {
          onProfilePictureFileChange(f);
          dispatch(
            updatePersonalInfo({
              profilePictureFileName: f.name,
              profilePicturePreview: URL.createObjectURL(f),
            })
          );
        }}
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
            onChange={(e) => dispatch(updatePersonalInfo({ cellPhone: e.target.value }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Work Phone"
            fullWidth
            value={formData.workPhone}
            onChange={(e) => dispatch(updatePersonalInfo({ workPhone: e.target.value }))}
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
            onChange={(e) => dispatch(updatePersonalInfo({ address: { street: e.target.value } }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Building / Apt #"
            fullWidth
            value={formData.address.building}
            onChange={(e) =>
              dispatch(updatePersonalInfo({ address: { building: e.target.value } }))
            }
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="City"
            required
            fullWidth
            value={formData.address.city}
            onChange={(e) => dispatch(updatePersonalInfo({ address: { city: e.target.value } }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="State"
            required
            fullWidth
            value={formData.address.state}
            onChange={(e) => dispatch(updatePersonalInfo({ address: { state: e.target.value } }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="ZIP Code"
            required
            fullWidth
            value={formData.address.zip}
            onChange={(e) => dispatch(updatePersonalInfo({ address: { zip: e.target.value } }))}
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
            onChange={(e) => dispatch(updatePersonalInfo({ ssn: e.target.value }))}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date of Birth"
            type="date"
            required
            fullWidth
            value={formData.dob}
            onChange={(e) => dispatch(updatePersonalInfo({ dob: e.target.value }))}
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
