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

import useErrorMap from '../../contexts/error-map/useErrorMap';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateWorkAuth } from '../../store/slices/employeeFormSlice';
import {
  WorkAuthorizationType,
  workAuthorizationCategories,
} from '../../store/slices/employeeFormTypes';
import FileUploadWithPreview from '../FileUploadWithPreview';
import { useTextFieldProps } from '../useTextFieldProps';
import { EmployeeFormProps } from './formProps';

export type WorkAuthorizationFormProps = {
  onF1OptDocumentChange: (f: File) => void;
} & EmployeeFormProps;

export default function WorkAuthorizationForm({
  onF1OptDocumentChange,
  forceCheck,
  readOnly,
}: WorkAuthorizationFormProps) {
  const formData = useAppSelector((state) => state.employeeForm.workAuth);
  const dispatch = useAppDispatch();

  const { updateErrorMap } = useErrorMap();

  const selectableTypes = formData.isCitizenOrPermanentResident
    ? workAuthorizationCategories.citizenOrPermanentResidentTypes
    : workAuthorizationCategories.foreignerTypes;

  const isForeigner = () => {
    return selectableTypes === workAuthorizationCategories.foreignerTypes;
  };

  const visaTitleProps = useTextFieldProps(
    {
      name: 'visaTitle',
      get: () => formData.extraAuthInfo.visaTitle ?? '',
      set: (v) =>
        dispatch(
          updateWorkAuth({
            extraAuthInfo: {
              visaTitle: v,
            },
          })
        ),
      required: () => formData.authorizationType === 'other',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const startDateProps = useTextFieldProps(
    {
      name: 'startDate',
      get: () => formData.extraAuthInfo.startDate ?? '',
      set: (v) =>
        dispatch(
          updateWorkAuth({
            extraAuthInfo: {
              startDate: v,
            },
          })
        ),
      required: isForeigner,
      type: 'date',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const endDateProps = useTextFieldProps(
    {
      name: 'endDate',
      get: () => formData.extraAuthInfo.endDate ?? '',
      set: (v) =>
        dispatch(
          updateWorkAuth({
            extraAuthInfo: {
              endDate: v,
            },
          })
        ),
      required: isForeigner,
      type: 'date',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  return (
    <Box component="form" noValidate sx={{ px: 2 }}>
      <Typography variant="h6" mb={1}>
        Work Authorization
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isCitizenOrPermanentResident}
                  disabled={readOnly}
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
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="citizen-label">Authorization Type</InputLabel>
            <Select
              labelId="citizen-label"
              value={formData.authorizationType}
              disabled={readOnly}
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
        </Grid>
      </Grid>
      {!formData.isCitizenOrPermanentResident && (
        <>
          <Typography variant="subtitle1" mt={4} sx={{ marginBlock: '1rem' }}>
            Additional Info
          </Typography>
          <Grid container spacing={2}>
            {formData.authorizationType == 'F1' && (
              <Grid size={{ xs: 12 }}>
                <FileUploadWithPreview
                  previewURL={formData.extraAuthInfo.optReceipt?.url}
                  fileName={formData.extraAuthInfo.optReceipt?.name}
                  previewOnly={readOnly}
                  type="document"
                  buttonText="Upload OPT Receipt"
                  onFileSelect={(f) => {
                    onF1OptDocumentChange(f);
                    dispatch(
                      updateWorkAuth({
                        extraAuthInfo: {
                          optReceipt: { name: f.name, url: URL.createObjectURL(f) },
                        },
                      })
                    );
                  }}
                />
              </Grid>
            )}
            {formData.authorizationType == 'other' && (
              <Grid size={{ xs: 12 }}>
                <TextField label="Visa Title" {...visaTitleProps()} />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="date"
                label="Start Date"
                {...startDateProps({ slotProps: { inputLabel: { shrink: true } } })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="date"
                label="End Date"
                slotProps={{ inputLabel: { shrink: true } }}
                {...endDateProps({ slotProps: { inputLabel: { shrink: true } } })}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
