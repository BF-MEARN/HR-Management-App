import { useEffect } from 'react';

import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';

import useErrorMap from '../../../contexts/error-map/useErrorMap';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateContacts } from '../../../store/slices/employeeFormSlice';
import { emptyContact } from '../../../store/slices/employeeFormTypes';
import { Contact } from '../../../store/slices/employeeTypes';
import { EmployeeFormProps } from '../formProps';
import ContactForm from './ContactForm';

const emptyEmergencyContractError = 'You must have at least one Emergency Contact.';

export type EmergencyContactFormProps = EmployeeFormProps;

export default function EmergencyContactForm(props: EmergencyContactFormProps) {
  const { readOnly } = props;

  const formData = useAppSelector((state) => state.employeeForm.contacts);
  const dispatch = useAppDispatch();

  const { updateErrorMap } = useErrorMap();

  useEffect(() => {
    if (formData.emergencyContacts.length == 0) {
      updateErrorMap('emergency-contract-length', emptyEmergencyContractError);
    } else {
      updateErrorMap('emergency-contract-length', undefined);
    }
  }, [formData.emergencyContacts.length, updateErrorMap]);

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
    <Box component="form" noValidate sx={{ px: 2 }}>
      <Typography variant="h6" mt={4} mb={1}>
        Emergency Contacts
      </Typography>
      {formData.emergencyContacts.length == 0 && (
        <Typography variant="body2" color="error">
          {emptyEmergencyContractError}
        </Typography>
      )}
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
