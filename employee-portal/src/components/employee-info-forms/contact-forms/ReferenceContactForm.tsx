import { Box, Card, CardContent, Checkbox, FormControlLabel, Typography } from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../../store';
import { updateContacts } from '../../../store/slices/employeeFormSlice';
import { EmployeeFormProps } from '../formProps';
import ContactForm from './ContactForm';

export type ReferenceContactFormProps = EmployeeFormProps;

export default function ReferenceContactForm(props: ReferenceContactFormProps) {
  const { readOnly } = props;

  const formData = useAppSelector((state) => state.employeeForm.contacts);
  const dispatch = useAppDispatch();

  return (
    <Box component="form" noValidate sx={{ px: 2 }}>
      <Typography variant="h6" mb={1}>
        Reference
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.hasReference}
            disabled={readOnly}
            onChange={(e) => dispatch(updateContacts({ hasReference: e.target.checked }))}
          />
        }
        label="I was referred by someone"
      />
      {formData.hasReference && (
        <Card variant="outlined" sx={{ margin: '0.5rem' }}>
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              Referral
            </Typography>
            <ContactForm
              id="form-reference"
              used={formData.hasReference}
              contact={formData.reference!}
              updateContact={(e) => dispatch(updateContacts({ reference: e }))}
              {...props}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
