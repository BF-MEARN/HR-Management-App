import React, { Dispatch } from 'react';

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
import { produce } from 'immer';

export interface Contact {
  firstName: string;
  lastName: string;
  middleName?: string;

  phone: string;
  email: string;
  relationship: string;
}

const emptyContact: Contact = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  relationship: '',
};

export interface ContactFormData {
  hasReference: boolean;
  reference?: Contact;
  emergencyContacts: Contact[];
}

function ContactForm({
  contact,
  setContact,
}: {
  contact: Contact;
  setContact: Dispatch<React.SetStateAction<Contact>>;
}) {
  const updateField = (key: keyof Contact, value: string) =>
    setContact((prev) =>
      produce(prev, (draft) => {
        draft[key] = value;
      })
    );
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="First Name"
          required
          fullWidth
          value={contact.firstName}
          onChange={(e) => updateField('firstName', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Last Name"
          required
          fullWidth
          value={contact.lastName}
          onChange={(e) => updateField('lastName', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Middle Name"
          fullWidth
          value={contact.middleName}
          onChange={(e) => updateField('middleName', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Cell Phone"
          required
          fullWidth
          value={contact.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Email"
          required
          fullWidth
          value={contact.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Relationship"
          required
          fullWidth
          value={contact.relationship}
          onChange={(e) => updateField('relationship', e.target.value)}
        />
      </Grid>
    </Grid>
  );
}

export default function ReferenceAndEmergencyContactForm({
  initFormData,
}: {
  initFormData: ContactFormData;
}) {
  const [formData, setFormData] = React.useState<ContactFormData>(
    initFormData ?? {
      hasReference: false,
      reference: { ...emptyContact },
      emergencyContacts: [],
    }
  );

  const updateEmergencyContact = (index: number, updated: Contact) => {
    setFormData((prev) =>
      produce(prev, (draft) => {
        draft.emergencyContacts[index] = updated;
      })
    );
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
            onChange={(e) =>
              setFormData((prev) =>
                produce(prev, (draft) => {
                  draft.hasReference = e.target.checked;
                  if (draft.hasReference && !draft.reference) {
                    draft.reference = emptyContact;
                  }
                })
              )
            }
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
              setContact={(updated) => {
                setFormData((prev) =>
                  produce(prev, (draft) => {
                    draft.reference = updated as Contact;
                  })
                );
              }}
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
              setContact={(updated) => updateEmergencyContact(i, updated as Contact)}
            />
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() =>
                setFormData((prev) =>
                  produce(prev, (draft) => {
                    draft.emergencyContacts.splice(i, 1);
                  })
                )
              }
            >
              Remove
            </Button>
          </CardActions>
        </Card>
      ))}
      <Button
        sx={{ mt: 1 }}
        onClick={() =>
          setFormData((prev) =>
            produce(prev, (draft) => {
              draft.emergencyContacts.push({ ...emptyContact });
            })
          )
        }
      >
        Add contact
      </Button>
    </Box>
  );
}
