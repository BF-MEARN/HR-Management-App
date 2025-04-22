import { Box, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../store';
import { updateDriverAndCar } from '../../store/slices/employeeFormSlice';
import FileUploadWithPreview from '../FileUploadWithPreview';

export interface DriverAndCarInfoFormProps {
  onDriverLicenseFileChange: (f: File) => void;
}

export default function DriverAndCarInfoForm({
  onDriverLicenseFileChange,
}: DriverAndCarInfoFormProps) {
  const formData = useAppSelector((state) => state.employeeForm.driverAndCar);
  const dispatch = useAppDispatch();
  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="h6" mb={1}>
        Driver&apos;s License
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.hasDriverLicense}
            slotProps={{ input: { 'aria-label': 'controlled' } }}
            onChange={(e) => dispatch(updateDriverAndCar({ hasDriverLicense: e.target.checked }))}
          />
        }
        label="I have a driver's license"
      />

      {formData.hasDriverLicense && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="License Number"
              fullWidth
              value={formData.driverLicense.number}
              onChange={(e) =>
                dispatch(updateDriverAndCar({ driverLicense: { number: e.target.value } }))
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              type="date"
              label="Expiration Date"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              value={formData.driverLicense.expirationDate}
              onChange={(e) =>
                dispatch(updateDriverAndCar({ driverLicense: { expirationDate: e.target.value } }))
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FileUploadWithPreview
              previewURL={formData.driverLicense.licensePreview}
              type="document"
              height="2rem"
              fileName={formData.driverLicense.licenseFileName}
              buttonText="Upload Driver's License"
              onFileSelect={(f) => {
                dispatch(
                  updateDriverAndCar({
                    driverLicense: {
                      licenseFileName: f.name,
                      licensePreview: URL.createObjectURL(f),
                    },
                  })
                );
                onDriverLicenseFileChange(f);
              }}
            />
          </Grid>
        </Grid>
      )}
      <Typography variant="h6" mb={1}>
        Car
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.hasCar}
            onChange={(e) => dispatch(updateDriverAndCar({ hasCar: e.target.checked }))}
          />
        }
        label="I have a car"
      />
      {formData.hasCar && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Car Make"
              fullWidth
              value={formData.carInfo.make}
              onChange={(e) => dispatch(updateDriverAndCar({ carInfo: { make: e.target.value } }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Car Model"
              fullWidth
              value={formData.carInfo.model}
              onChange={(e) => dispatch(updateDriverAndCar({ carInfo: { model: e.target.value } }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Car Color"
              fullWidth
              value={formData.carInfo.color}
              onChange={(e) => dispatch(updateDriverAndCar({ carInfo: { color: e.target.value } }))}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
