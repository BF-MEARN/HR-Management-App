import React from 'react';

import { Box, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { produce } from 'immer';

import FileUploadWithPreview from '../FileUploadWithPreview';

export interface DriverAndCarFormData {
  hasDriverLicense: boolean;
  driverLicense?: {
    number: string;
    expirationDate: string;
    file?: File | string;
  };
  hasCar: boolean;
  carInfo?: {
    make: string;
    model: string;
    color: string;
  };
}

const emptyLicenseEntry = { number: '', expirationDate: '', file: undefined };
const emptyCarEntry = {
  make: '',
  model: '',
  color: '',
};

export default function DriverAndCarInfoForm(props: { initFormData?: DriverAndCarFormData }) {
  const [formData, setFormData] = React.useState<DriverAndCarFormData>(
    props.initFormData ?? { hasDriverLicense: false, hasCar: false }
  );
  return (
    <Box sx={{ display: 'flex', flexFlow: 'column' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.hasDriverLicense}
            slotProps={{ input: { 'aria-label': 'controlled' } }}
            onChange={(e) =>
              setFormData((prev) =>
                produce(prev, (draft) => {
                  draft.hasDriverLicense = e.target.checked;
                  draft.driverLicense = prev.driverLicense ?? emptyLicenseEntry;
                })
              )
            }
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
              value={formData.driverLicense?.number}
              onChange={(e) =>
                setFormData((prev) =>
                  produce(prev, (draft) => {
                    draft.driverLicense!.number = e.target.value;
                  })
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              type="date"
              label="Expiration Date"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              value={formData.driverLicense?.expirationDate}
              onChange={(e) =>
                setFormData((prev) =>
                  produce(prev, (draft) => {
                    draft.driverLicense!.expirationDate = e.target.value;
                  })
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FileUploadWithPreview
              file={formData.driverLicense?.file}
              type="document"
              height={'2rem'}
              buttonText="Upload Driver's License"
              onFileSelect={(file) =>
                setFormData((prev) =>
                  produce(prev, (draft) => {
                    draft.driverLicense!.file = file;
                  })
                )
              }
            />
          </Grid>
        </Grid>
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.hasCar}
            onChange={(e) =>
              setFormData((prev) =>
                produce(prev, (draft) => {
                  draft.hasCar = e.target.checked;
                  draft.carInfo = prev.carInfo ?? emptyCarEntry;
                })
              )
            }
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
              value={formData.carInfo?.make}
              onChange={(e) =>
                setFormData((prev) =>
                  produce(prev, (draft) => {
                    draft.carInfo!.make = e.target.value;
                  })
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Car Model"
              fullWidth
              value={formData.carInfo?.model}
              onChange={(e) =>
                setFormData((prev) =>
                  produce(prev, (draft) => {
                    draft.carInfo!.model = e.target.value;
                  })
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Car Color"
              fullWidth
              value={formData.carInfo?.color}
              onChange={(e) =>
                setFormData((prev) =>
                  produce(prev, (draft) => {
                    draft.carInfo!.color = e.target.value;
                  })
                )
              }
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
