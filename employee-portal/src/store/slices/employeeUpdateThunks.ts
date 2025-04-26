import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../utils/utils';
import { RootState } from '../store';
import { EmployeeFormPayload } from './employeeFormTypes';

const endPointEmployeeName = 'employee/personal-info/name';
export const updateEmployeeName = createAsyncThunk(
  endPointEmployeeName,
  async (_, { getState, rejectWithValue }) => {
    const { employeeForm: forms } = getState() as RootState;
    const payload: Partial<EmployeeFormPayload> = {
      firstName: forms.personalInfo.firstName,
      lastName: forms.personalInfo.lastName,
      middleName: forms.personalInfo.middleName,
      preferredName: forms.personalInfo.preferredName,
      profilePicture: forms.personalInfo.profilePicture?.url, // TODO: replace with s3
      ssn: forms.personalInfo.ssn,
      dob: forms.personalInfo.dob,
      gender: forms.personalInfo.gender,
    };
    try {
      const res = await api('/employee/personal-info/name', {
        method: 'put',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return rejectWithValue(
          `${endPointEmployeeName}: ${res.status} ${(await res.json()).message}`
        );
      }
      return await res.json();
    } catch (e) {
      console.error(endPointEmployeeName, e);
      return rejectWithValue('Network or server error');
    }
  }
);

const endPointEmployeeAddress = 'employee/personal-info/address';
export const updateEmployeeAddress = createAsyncThunk(
  endPointEmployeeAddress,
  async (_, { getState, rejectWithValue }) => {
    const { employeeForm: forms } = getState() as RootState;
    const payload: Partial<EmployeeFormPayload> = {
      address: forms.personalInfo.address,
    };
    try {
      const res = await api('/employee/personal-info/address', {
        method: 'put',
        body: JSON.stringify({ ...payload.address }),
      });

      if (!res.ok) {
        return rejectWithValue(
          `${endPointEmployeeAddress}: ${res.status} ${(await res.json()).message}`
        );
      }
      return await res.json();
    } catch (e) {
      console.error(endPointEmployeeAddress, e);
      return rejectWithValue('Network or server error');
    }
  }
);

const endPointEmployeeContactInfo = 'employee/personal-info/contact-info';
export const updateEmployeeContactInfo = createAsyncThunk(
  endPointEmployeeContactInfo,
  async (_, { getState, rejectWithValue }) => {
    const { employeeForm: forms } = getState() as RootState;

    const payload = {
      cellPhone: forms.personalInfo.cellPhone,
      workPhone: forms.personalInfo.workPhone,
    };

    try {
      const res = await api('/employee/personal-info/contact-info', {
        method: 'put',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return rejectWithValue(
          `${endPointEmployeeContactInfo}: ${res.status} ${(await res.json()).message}`
        );
      }
      return await res.json();
    } catch (e) {
      console.error(endPointEmployeeContactInfo, e);
      return rejectWithValue('Network or server error');
    }
  }
);

const endPointEmployeeEmployment = 'employee/personal-info/employment';
export const updateEmployeeEmploymentInfo = createAsyncThunk(
  endPointEmployeeEmployment,
  async (_, { getState, rejectWithValue }) => {
    const { employeeForm: forms } = getState() as RootState;

    const payload = {
      workAuthorization: {
        type: forms.workAuth.authorizationType,
        startDate: forms.workAuth.extraAuthInfo.startDate,
        endDate: forms.workAuth.extraAuthInfo.endDate,
        otherTitle: forms.workAuth.extraAuthInfo.visaTitle,
      },
    };

    try {
      const res = await api('/employee/personal-info/employment', {
        method: 'put',
        body: JSON.stringify({ workAuthorization: payload.workAuthorization }),
      });

      if (!res.ok) {
        return rejectWithValue(
          `${endPointEmployeeEmployment}: ${res.status} ${(await res.json()).message}`
        );
      }
      return await res.json();
    } catch (e) {
      console.error(endPointEmployeeEmployment, e);
      return rejectWithValue('Network or server error');
    }
  }
);

const endPointEmployeeEmergencyContact = 'employee/personal-info/emergency-contact';
export const updateEmployeeEmergencyContact = createAsyncThunk(
  endPointEmployeeEmergencyContact,
  async (_, { getState, rejectWithValue }) => {
    const { employeeForm: forms } = getState() as RootState;

    const payload = {
      emergencyContacts: forms.contacts.emergencyContacts,
    };

    try {
      const res = await api('/employee/personal-info/emergency-contact', {
        method: 'put',
        body: JSON.stringify({ emergencyContacts: payload.emergencyContacts }),
      });

      if (!res.ok) {
        return rejectWithValue(
          `${endPointEmployeeEmergencyContact}: ${res.status} ${(await res.json()).message}`
        );
      }
      return await res.json();
    } catch (e) {
      console.error(endPointEmployeeEmergencyContact, e);
      return rejectWithValue('Network or server error');
    }
  }
);
