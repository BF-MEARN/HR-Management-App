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
import { Contact, emptyContact } from '../../store/slices/employeeFormTypes';

function ContactForm({
  contact,
  updateContact,
}: {
  contact: Contact;
  updateContact: (patch: Partial<Contact>) => void;
}) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="First Name"
          required
          fullWidth
          value={contact.firstName}
          onChange={(e) => updateContact({ firstName: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Last Name"
          required
          fullWidth
          value={contact.lastName}
          onChange={(e) => updateContact({ lastName: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Middle Name"
          fullWidth
          value={contact.middleName}
          onChange={(e) => updateContact({ middleName: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Cell Phone"
          required
          fullWidth
          value={contact.phone}
          onChange={(e) => updateContact({ phone: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Email"
          required
          fullWidth
          value={contact.email}
          onChange={(e) => updateContact({ email: e.target.value })}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Relationship"
          required
          fullWidth
          value={contact.relationship}
          onChange={(e) => updateContact({ relationship: e.target.value })}
        />
      </Grid>
    </Grid>
  );
}

export default function ReferenceAndEmergencyContactForm() {
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
            />
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => spliceEmergencyContact(i)}>
              Remove
            </Button>
          </CardActions>
        </Card>
      ))}
      <Button sx={{ mt: 1 }} onClick={addNewEmergencyContact}>
        Add contact
      </Button>
    </Box>
  );
}
