import { Box, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../store';
import { updateDriverAndCar } from '../../store/slices/employeeFormSlice';
import FileUploadWithPreview from '../FileUploadWithPreview';
import { useErrorMap, useTextFieldProps } from '../useTextFieldProps';
import { EmployeeFormProps } from './formProps';

export type DriverAndCarInfoFormProps = {
  onDriverLicenseFileChange: (f: File) => void;
} & EmployeeFormProps;

function DriverAndCarInfoForm({
  onDriverLicenseFileChange,
  onFormStatusChange,
  readOnly,
  forceCheck,
}: DriverAndCarInfoFormProps) {
  const formData = useAppSelector((state) => state.employeeForm.driverAndCar);
  const dispatch = useAppDispatch();
  const updateErrorMap = useErrorMap(onFormStatusChange);

  const licenseNumberProps = useTextFieldProps(
    {
      name: 'licenseNumber',
      get: () => formData.driverLicense.number ?? '',
      set: (v) => dispatch(updateDriverAndCar({ driverLicense: { number: v } })),
      required: () => formData.hasDriverLicense,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const licenseExpirationProps = useTextFieldProps(
    {
      name: 'expirationDate',
      get: () => formData.driverLicense.expirationDate ?? '',
      set: (v) => dispatch(updateDriverAndCar({ driverLicense: { expirationDate: v } })),
      required: () => formData.hasDriverLicense,
      type: 'date',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const carMakeProps = useTextFieldProps(
    {
      name: 'make',
      get: () => formData.carInfo.make ?? '',
      set: (v) => dispatch(updateDriverAndCar({ carInfo: { make: v } })),
      required: () => formData.hasCar,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const carModelProps = useTextFieldProps(
    {
      name: 'model',
      get: () => formData.carInfo.model ?? '',
      set: (v) => dispatch(updateDriverAndCar({ carInfo: { model: v } })),
      required: () => formData.hasCar,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const carColorProps = useTextFieldProps(
    {
      name: 'color',
      get: () => formData.carInfo.color ?? '',
      set: (v) => dispatch(updateDriverAndCar({ carInfo: { color: v } })),
      required: () => formData.hasCar,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="h6" mb={1}>
        Driver&apos;s License
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            disabled={readOnly}
            checked={formData.hasDriverLicense}
            onChange={(e) => dispatch(updateDriverAndCar({ hasDriverLicense: e.target.checked }))}
          />
        }
        label="I have a driver's license"
      />
      {formData.hasDriverLicense && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField label="License Number" {...licenseNumberProps()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Expiration Date"
              type="date"
              {...licenseExpirationProps({ slotProps: { inputLabel: { shrink: true } } })}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FileUploadWithPreview
              previewURL={formData.driverLicense.license.url}
              type="document"
              fileName={formData.driverLicense.license.name}
              buttonText="Upload Driver's License"
              previewOnly={readOnly}
              onFileSelect={(f) => {
                dispatch(
                  updateDriverAndCar({
                    driverLicense: {
                      license: { name: f.name, url: URL.createObjectURL(f) },
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
            disabled={readOnly}
            checked={formData.hasCar}
            onChange={(e) => dispatch(updateDriverAndCar({ hasCar: e.target.checked }))}
          />
        }
        label="I have a car"
      />
      {formData.hasCar && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Car Make" {...carMakeProps()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Car Model" {...carModelProps()} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField label="Car Color" {...carColorProps()} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default DriverAndCarInfoForm;
