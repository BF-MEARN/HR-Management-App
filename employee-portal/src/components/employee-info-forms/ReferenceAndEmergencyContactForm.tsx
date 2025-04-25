import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../store';
import { updateContacts } from '../../store/slices/employeeFormSlice';
import { emptyContact } from '../../store/slices/employeeFormTypes';
import { Contact } from '../../store/slices/employeeTypes';
import { useErrorMap, useTextFieldProps } from '../useTextFieldProps';
import { EmployeeFormProps } from './formProps';

function ContactForm({
  contact,
  updateContact,
  onFormStatusChange,
  forceCheck,
  readOnly = false,
}: {
  contact: Contact;
  updateContact: (patch: Partial<Contact>) => void;
} & EmployeeFormProps) {
  const updateErrorMap = useErrorMap(onFormStatusChange);

  const firstNameProps = useTextFieldProps(
    {
      name: 'firstName',
      get: () => contact.firstName ?? '',
      set: (v) => updateContact({ firstName: v }),
      required: true,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const lastNameProps = useTextFieldProps(
    {
      name: 'lastName',
      get: () => contact.lastName ?? '',
      set: (v) => updateContact({ lastName: v }),
      required: true,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const middleNameProps = useTextFieldProps(
    {
      name: 'middleName',
      get: () => contact.middleName ?? '',
      set: (v) => updateContact({ middleName: v }),
      required: false,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const cellPhoneProps = useTextFieldProps(
    {
      name: 'cellPhone',
      get: () => contact.phone ?? '',
      set: (v) => updateContact({ phone: v }),
      required: true,
      type: 'phone',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const emailProps = useTextFieldProps(
    {
      name: 'email',
      get: () => contact.email ?? '',
      set: (v) => updateContact({ email: v }),
      required: true,
      type: 'email',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const relationshipProps = useTextFieldProps(
    {
      name: 'relationship',
      get: () => contact.relationship ?? '',
      set: (v) => updateContact({ relationship: v }),
      required: true,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField label="First Name" {...firstNameProps()} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField label="Last Name" {...lastNameProps()} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField label="Middle Name" {...middleNameProps()} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField label="Cell Phone" {...cellPhoneProps()} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField label="Email" {...emailProps()} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField label="Relationship" {...relationshipProps()} />
      </Grid>
    </Grid>
  );
}

export type ReferenceAndEmergencyContactFormProps = EmployeeFormProps;

export default function ReferenceAndEmergencyContactForm(
  props: ReferenceAndEmergencyContactFormProps
) {
  const { readOnly } = props;

  const formData = useAppSelector((state) => state.employeeForm.contacts);
  const dispatch = useAppDispatch();

  const updateEmergencyContact = (index: number, patch: Partial<Contact>) => {
    const newArray = [...formData.emergencyContacts];
    const patchedContact = { ...newArray[index], ...patch };
    newArray[index] = patchedContact;
    dispatch(updateContacts({ emergencyContacts: newArray }));
  };

  const spliceEmergencyContact = (index: number) => {
    const newArray = [
      ...formData.emergencyContacts.slice(0, index),
      ...formData.emergencyContacts.slice(index + 1),
    ];
    dispatch(updateContacts({ emergencyContacts: newArray }));
  };
  const addNewEmergencyContact = () => {
    const newArray = [...formData.emergencyContacts, emptyContact];
    dispatch(updateContacts({ emergencyContacts: newArray }));
  };

  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="h6" mb={1}>
        Reference
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={formData.hasReference}
            readOnly={readOnly}
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
              contact={formData.reference!}
              updateContact={(e) => dispatch(updateContacts({ reference: e }))}
              {...props}
            />
          </CardContent>
        </Card>
      )}
      <Typography variant="h6" mb={1}>
        Emergency Contacts
      </Typography>
      {formData.emergencyContacts.map((contact, i) => (
        <Card
          variant="outlined"
          sx={{ margin: '0.5rem' }}
          key={`${contact.firstName}-${contact.email}-${i}`}
        >
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              Emergency Contact {i + 1}
            </Typography>
            <ContactForm
              contact={contact}
              updateContact={(updated) => updateEmergencyContact(i, updated)}
              {...props}
            />
          </CardContent>
          <CardActions>
            <Button size="small" disabled={readOnly} onClick={() => spliceEmergencyContact(i)}>
              Remove
            </Button>
          </CardActions>
        </Card>
      ))}
      <Button sx={{ mt: 1 }} disabled={readOnly} onClick={addNewEmergencyContact}>
        Add contact
      </Button>
    </Box>
  );
}
