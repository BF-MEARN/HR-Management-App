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

import { useAppDispatch, useAppSelector } from '../../store';
import { updateWorkAuth } from '../../store/slices/employeeFormSlice';
import {
  WorkAuthorizationType,
  workAuthorizationCategories,
} from '../../store/slices/employeeFormTypes';
import FileUploadWithPreview from '../FileUploadWithPreview';

export interface WorkAuthorizationFormProps {
  onF1OptDocumentChange: (f: File) => void;
}

export default function WorkAuthorizationForm({
  onF1OptDocumentChange,
}: WorkAuthorizationFormProps) {
  const formData = useAppSelector((state) => state.employeeForm.workAuth);
  const dispatch = useAppDispatch();

  const selectableTypes = formData.isCitizenOrPermanentResident
    ? workAuthorizationCategories.citizenOrPermanentResidentTypes
    : workAuthorizationCategories.foreignerTypes;
  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="h6" mb={1}>
        Work Authorization
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.isCitizenOrPermanentResident}
            onChange={(e) => {
              const types = e.target.checked
                ? workAuthorizationCategories.citizenOrPermanentResidentTypes
                : workAuthorizationCategories.foreignerTypes;
              dispatch(
                updateWorkAuth({
                  isCitizenOrPermanentResident: e.target.checked,
                  authorizationType: Object.keys(types)[0] as WorkAuthorizationType,
                })
              );
            }}
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
            dispatch(
              updateWorkAuth({
                authorizationType: e.target.value as WorkAuthorizationType,
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
          <Typography variant="subtitle1" sx={{ marginBlock: '1rem' }}>
            Additional Info
          </Typography>
          <Grid container spacing={2}>
            {formData.authorizationType == 'f1' && (
              <Grid size={{ xs: 12 }}>
                <FileUploadWithPreview
                  previewURL={formData.extraAuthInfo.f1DocumentPreview}
                  fileName={formData.extraAuthInfo.f1DocumentName}
                  type="document"
                  height="2rem"
                  buttonText="Upload OPT Receipt"
                  onFileSelect={(file) => {
                    onF1OptDocumentChange(file);
                    dispatch(
                      updateWorkAuth({
                        extraAuthInfo: {
                          f1DocumentName: file.name,
                          f1DocumentPreview: URL.createObjectURL(file),
                        },
                      })
                    );
                  }}
                />
              </Grid>
            )}
            {formData.authorizationType == 'other' && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Visa Title"
                  fullWidth
                  value={formData.extraAuthInfo.visaTitle}
                  onChange={(e) =>
                    dispatch(
                      updateWorkAuth({
                        extraAuthInfo: {
                          visaTitle: e.target.value,
                        },
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
                value={formData.extraAuthInfo.startDate}
                onChange={(e) =>
                  dispatch(
                    updateWorkAuth({
                      extraAuthInfo: {
                        startDate: e.target.value,
                      },
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
                value={formData.extraAuthInfo.endDate}
                onChange={(e) =>
                  dispatch(
                    updateWorkAuth({
                      extraAuthInfo: {
                        endDate: e.target.value,
                      },
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
