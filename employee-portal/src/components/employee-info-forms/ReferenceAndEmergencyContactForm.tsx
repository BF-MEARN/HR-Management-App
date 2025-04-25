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
  id,
  used,
  contact,
  updateContact,
  updateErrorMap,
  forceCheck,
  readOnly,
}: {
  id: string;
  contact: Contact;
  updateContact: (patch: Partial<Contact>) => void;
  updateErrorMap: (key: string, error: string | undefined) => void;
  used: boolean;
  readOnly: boolean;
  forceCheck: boolean;
}) {
  const firstNameProps = useTextFieldProps(
    {
      name: `${id}-firstName`,
      get: () => contact.firstName ?? '',
      set: (v) => updateContact({ firstName: v }),
      required: used,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const lastNameProps = useTextFieldProps(
    {
      name: `${id}-lastName`,
      get: () => contact.lastName ?? '',
      set: (v) => updateContact({ lastName: v }),
      required: used,
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const middleNameProps = useTextFieldProps(
    {
      name: `${id}-middleName`,
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
      name: `${id}-cellPhone`,
      get: () => contact.phone ?? '',
      set: (v) => updateContact({ phone: v }),
      required: used,
      type: 'phone',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const emailProps = useTextFieldProps(
    {
      name: `${id}-email`,
      get: () => contact.email ?? '',
      set: (v) => updateContact({ email: v }),
      required: used,
      type: 'email',
      readOnly,
    },
    forceCheck,
    updateErrorMap
  );

  const relationshipProps = useTextFieldProps(
    {
      name: `${id}-relationship`,
      get: () => contact.relationship ?? '',
      set: (v) => updateContact({ relationship: v }),
      required: used,
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
  const { readOnly, onFormStatusChange } = props;

  const formData = useAppSelector((state) => state.employeeForm.contacts);
  const dispatch = useAppDispatch();
  const updateErrorMap = useErrorMap(onFormStatusChange);

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
              updateErrorMap={updateErrorMap}
              used={formData.hasReference}
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
              id={`form-emergency-${i}`}
              used={formData.emergencyContacts.includes(contact)}
              contact={contact}
              updateErrorMap={updateErrorMap}
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
