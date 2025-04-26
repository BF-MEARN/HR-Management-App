import React from 'react';

import { Box, Button, Divider, Paper, Snackbar } from '@mui/material';

import AddressForm from '../components/employee-info-forms/AddressForm';
import BasicInfoForm from '../components/employee-info-forms/BasicInfoForm';
import DocumentConfirmation from '../components/employee-info-forms/DocumentConfirmation';
import PhoneContactForm from '../components/employee-info-forms/PhoneContactForm';
import WorkAuthorizationForm from '../components/employee-info-forms/WorkAuthorizationForm';
import EmergencyContactForm from '../components/employee-info-forms/contact-forms/EmergencyContactForm';
import useErrorMap from '../contexts/error-map/useErrorMap';
import { useAppDispatch, useAppSelector } from '../store';
import { updateFormsWithEmployee } from '../store/slices/employeeFormSlice';
import { fetchEmployeeData } from '../store/slices/employeeSlice';
import { Employee } from '../store/slices/employeeTypes';
import {
  updateEmployeeAddress,
  updateEmployeeContactInfo,
  updateEmployeeEmergencyContact,
  updateEmployeeEmploymentInfo,
  updateEmployeeName,
} from '../store/slices/employeeUpdateThunks';

function EditBar({
  editing,
  setEditing,
  handleReset,
  handleSubmit,
}: {
  editing: boolean;
  setEditing: (v: boolean) => void;
  handleReset: () => void;
  handleSubmit: () => void;
}) {
  const { validateAll } = useErrorMap();
  const [showErrorSnackBar, setErrorSnackBar] = React.useState(false);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showErrorSnackBar}
        autoHideDuration={5000}
        onClose={() => setErrorSnackBar(false)}
        message="One or more fields are not filled correctly."
      />
      <Box mt={4} sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        {editing && (
          <Button
            color="inherit"
            onClick={() => {
              handleReset();
              setEditing(false);
            }}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
        )}
        <Box sx={{ flex: '1 1 auto' }} />
        {editing ? (
          <Button
            onClick={() => {
              if (validateAll()) {
                handleSubmit();
                setEditing(false);
              } else {
                setErrorSnackBar(true);
              }
            }}
          >
            Submit
          </Button>
        ) : (
          <Button onClick={() => setEditing(true)}>Edit</Button>
        )}
      </Box>
    </>
  );
}

export default function OnBoardingApplicationPage() {
  const profilePictureRef = React.useRef<File | null>(null);
  const f1OptDocRef = React.useRef<File | null>(null);

  const employee = useAppSelector((state) => state.employee.employee) as Employee;
  const forceCheckEnabled = true;
  const dispatch = useAppDispatch();

  const updateCounter = useAppSelector((state) => state.employeeForm.updateCounter);
  const [requestSentSnackBarOpen, setRequestSentSnackBarOpen] = React.useState(false);

  React.useEffect(() => {
    if (updateCounter > 0) {
      dispatch(fetchEmployeeData());
      setRequestSentSnackBarOpen(true);
    }
  }, [updateCounter, dispatch]);

  const handleReset = () => {
    dispatch(updateFormsWithEmployee(employee));
  };

  const [editingName, setEditingName] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState(false);
  const [editingPhoneContact, setEditingPhoneContact] = React.useState(false);
  const [editingEmployment, setEditingEmployment] = React.useState(false);
  const [editingEmergencyContact, setEditingEmergencyContact] = React.useState(false);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={requestSentSnackBarOpen}
        autoHideDuration={5000}
        onClose={() => setRequestSentSnackBarOpen(false)}
        message="Your info is updated successfully."
      />

      <Paper elevation={1} sx={{ width: '80%', margin: 'auto', padding: '2rem' }}>
        <BasicInfoForm
          onProfilePictureFileChange={(f: File) => (profilePictureRef.current = f)}
          readOnly={!editingName}
          forceCheck={forceCheckEnabled}
        />
        <EditBar
          editing={editingName}
          setEditing={setEditingName}
          handleReset={handleReset}
          handleSubmit={() => {
            dispatch(updateEmployeeName());
          }}
        />
        <Divider sx={{ mt: 2, mb: 2 }} />

        <AddressForm readOnly={!editingAddress} forceCheck={forceCheckEnabled} />
        <EditBar
          editing={editingAddress}
          setEditing={setEditingAddress}
          handleReset={handleReset}
          handleSubmit={() => {
            dispatch(updateEmployeeAddress());
          }}
        />
        <Divider sx={{ mt: 2, mb: 2 }} />

        <PhoneContactForm readOnly={!editingPhoneContact} forceCheck={forceCheckEnabled} />
        <EditBar
          editing={editingPhoneContact}
          setEditing={setEditingPhoneContact}
          handleReset={handleReset}
          handleSubmit={() => {
            dispatch(updateEmployeeContactInfo());
          }}
        />
        <Divider sx={{ mt: 2, mb: 2 }} />

        <WorkAuthorizationForm
          onF1OptDocumentChange={(f: File) => (f1OptDocRef.current = f)}
          readOnly={!editingEmployment}
          forceCheck={forceCheckEnabled}
        />
        <EditBar
          editing={editingEmployment}
          setEditing={setEditingEmployment}
          handleReset={handleReset}
          handleSubmit={() => {
            dispatch(updateEmployeeEmploymentInfo());
          }}
        />
        <Divider sx={{ mt: 2, mb: 2 }} />

        <EmergencyContactForm readOnly={!editingEmergencyContact} forceCheck={forceCheckEnabled} />
        <EditBar
          editing={editingEmergencyContact}
          setEditing={setEditingEmergencyContact}
          handleReset={handleReset}
          handleSubmit={() => {
            dispatch(updateEmployeeEmergencyContact());
          }}
        />
        <Divider sx={{ mt: 2, mb: 2 }} />
        <DocumentConfirmation />
      </Paper>
    </>
  );
}
