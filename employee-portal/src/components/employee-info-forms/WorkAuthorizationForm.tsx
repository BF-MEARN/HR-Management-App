import React from 'react';

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { produce } from 'immer';

import FileUploadWithPreview from '../FileUploadWithPreview';

const citizenOrPermanentResidentTypes = {
  citizen: 'Citizen',
  green_card: 'Permanent Resident (Green Card)',
};
const foreignerTypes = { 'h1-b': 'H1-B', l2: 'L2', f1: 'F1 (CPT/OPT)', h4: 'H4', other: 'Other' };

type AuthorizationType = keyof typeof citizenOrPermanentResidentTypes | keyof typeof foreignerTypes;
export interface WorkAuthorizationFormData {
  isCitizenOrPermanentResident: boolean;
  authorizationType: AuthorizationType;
  f1Document?: File | string;
  visaTitle?: string;
  startDate?: string;
  endDate?: string;
}

export default function WorkAuthorizationForm({
  initFormData,
}: {
  initFormData: WorkAuthorizationFormData;
}) {
  const [formData, setFormData] = React.useState<WorkAuthorizationFormData>(
    initFormData ?? {
      isCitizenOrPermanentResident: true,
      authorizationType: 'citizen',
    }
  );
  const selectableTypes = formData.isCitizenOrPermanentResident
    ? citizenOrPermanentResidentTypes
    : foreignerTypes;
  return (
    <Box sx={{ display: 'flex', flexFlow: 'column', gap: '2rem' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isCitizenOrPermanentResident}
            onChange={(e) =>
              setFormData((prev) =>
                produce(prev, (draft) => {
                  if (prev.isCitizenOrPermanentResident == e.target.checked) return;
                  draft.isCitizenOrPermanentResident = e.target.checked;
                  const types = e.target.checked ? citizenOrPermanentResidentTypes : foreignerTypes;
                  draft.authorizationType = Object.keys(types)[0] as AuthorizationType;
                })
              )
            }
          />
        }
        label="I am a US citizen or a permanent US resident"
      />
      <FormControl fullWidth>
        <InputLabel id="citizen-label">Authorization Type</InputLabel>
        <Select
          labelId="citizen-label"
          value={formData.authorizationType}
          label="Authorization Type"
          onChange={(e) =>
            setFormData((prev) =>
              produce(prev, (draft) => {
                draft.authorizationType = e.target.value as typeof formData.authorizationType;
              })
            )
          }
        >
          {Object.entries(selectableTypes).map(([k, v]) => (
            <MenuItem key={k} value={k}>
              {v}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {!formData.isCitizenOrPermanentResident && (
        <>
          <Typography variant="subtitle1" fontWeight="bold">
            Additional Info
          </Typography>
          <Grid container spacing={2}>
            {formData.authorizationType == 'f1' && (
              <Grid size={{ xs: 12 }}>
                <FileUploadWithPreview
                  file={formData.f1Document}
                  type="document"
                  height={'2rem'}
                  buttonText="Upload OPT Receipt"
                  onFileSelect={(file) =>
                    setFormData((prev) =>
                      produce(prev, (draft) => {
                        draft.f1Document = file;
                      })
                    )
                  }
                />
              </Grid>
            )}
            {formData.authorizationType == 'other' && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Visa Title"
                  fullWidth
                  value={formData.visaTitle}
                  onChange={(e) =>
                    setFormData((prev) =>
                      produce(prev, (draft) => {
                        draft.visaTitle = e.target.value;
                      })
                    )
                  }
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="date"
                label="Start Date"
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) =>
                    produce(prev, (draft) => {
                      draft.startDate = e.target.value;
                    })
                  )
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="date"
                label="End Date"
                slotProps={{ inputLabel: { shrink: true } }}
                fullWidth
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) =>
                    produce(prev, (draft) => {
                      draft.endDate = e.target.value;
                    })
                  )
                }
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
