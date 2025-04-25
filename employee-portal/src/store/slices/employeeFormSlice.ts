import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { DeepPartial, api, formatDateString, smartUpdate } from '../../utils/utils';
import { RootState } from '../store';
import {
  ContactFormData,
  DriverAndCarFormData,
  OnboardingApplicationPayload,
  PersonalInfoFormData,
  WorkAuthorizationFormData,
  WorkAuthorizationType,
  emptyCarEntry,
  emptyContact,
  emptyContactFormData,
  emptyDriverAndCarFormData,
  emptyLicenseEntry,
  emptyPersonalInfoFormData,
  emptyWorkAuthorizationFormData,
} from './employeeFormTypes';
import { Employee } from './employeeTypes';

export interface EmployeeFormState {
  personalInfo: PersonalInfoFormData;
  driverAndCar: DriverAndCarFormData;
  workAuth: WorkAuthorizationFormData;
  contacts: ContactFormData;
  requestStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  requestError?: string;
}

const initialState: EmployeeFormState = {
  personalInfo: emptyPersonalInfoFormData,
  driverAndCar: emptyDriverAndCarFormData,
  workAuth: emptyWorkAuthorizationFormData,
  contacts: emptyContactFormData,
  requestStatus: 'idle',
};

export const postOnboardingSubmission = createAsyncThunk(
  'employee/onboarding/',
  async (_, { getState, rejectWithValue }) => {
    const { employeeForm: forms } = getState() as RootState;
    const payload: OnboardingApplicationPayload = {
      firstName: forms.personalInfo.firstName,
      lastName: forms.personalInfo.lastName,
      ssn: forms.personalInfo.ssn,
      dob: forms.personalInfo.dob,
      address: forms.personalInfo.address,
      gender: forms.personalInfo.gender,
      contactInfo: {
        cellPhone: forms.personalInfo.cellPhone,
        workPhone: forms.personalInfo.workPhone,
      },
      isCitizenOrPR: forms.workAuth.isCitizenOrPermanentResident,
      visaInfo: {
        workAuthorization: {
          type: forms.workAuth.authorizationType,
          startDate: forms.workAuth.extraAuthInfo.startDate,
          endDate: forms.workAuth.extraAuthInfo.endDate,
          otherTitle: forms.workAuth.extraAuthInfo.visaTitle,
        },
        optReceipt:
          forms.workAuth.authorizationType === 'F1'
            ? {
                file: forms.workAuth.extraAuthInfo.optReceipt?.url,
              }
            : undefined,
      },
      reference: forms.contacts.reference,
      emergencyContacts: forms.contacts.emergencyContacts,
    };
    try {
      const res = await api('/employee/onboarding', {
        method: 'post',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return rejectWithValue(`employee/onboarding: ${res.status} ${await res.json()}`);
      }
      return await res.json();
    } catch (e) {
      console.error('employee/onboarding:', e);
      return rejectWithValue('Network or server error');
    }
  }
);

const employeeFormSlice = createSlice({
  name: 'employeeForm',
  initialState,
  reducers: {
    updateFormsWithEmployee: (state, action: PayloadAction<Employee>) => {
      const {
        userId,
        firstName,
        lastName,
        middleName,
        preferredName,
        profilePicture,
        ssn,
        dob,
        gender,
        address,
        contactInfo,
        isCitizenOrPR,
        visaInfo,
        driverLicense,
        carInfo,
        reference,
        emergencyContacts,
      } = action.payload;
      state.personalInfo = {
        firstName,
        lastName,
        middleName,
        preferredName,
        cellPhone: contactInfo.cellPhone,
        workPhone: contactInfo.workPhone,
        email: userId.email,
        address,
        ssn,
        dob: formatDateString(dob),
        gender,
        profilePicture: profilePicture
          ? {
              name: profilePicture,
              url: profilePicture,
            }
          : undefined,
      };
      state.driverAndCar = {
        hasDriverLicense: driverLicense !== undefined,
        driverLicense: driverLicense
          ? {
              number: driverLicense.number,
              expirationDate: formatDateString(driverLicense.expirationDate),
              license: {
                name: driverLicense.file,
                url: driverLicense.file,
              },
            }
          : emptyLicenseEntry,
        hasCar: carInfo !== undefined,
        carInfo: carInfo ?? emptyCarEntry,
      };
      state.workAuth = {
        isCitizenOrPermanentResident: isCitizenOrPR,
        authorizationType: visaInfo.workAuthorization.type as WorkAuthorizationType,
        extraAuthInfo: {
          startDate: formatDateString(visaInfo.workAuthorization.startDate),
          endDate: formatDateString(visaInfo.workAuthorization.endDate),
          visaTitle: visaInfo.workAuthorization.otherTitle,
        },
      };
      state.contacts = {
        hasReference: reference !== undefined,
        reference: reference ?? emptyContact,
        emergencyContacts,
      };
    },
    updatePersonalInfo: (state, action: PayloadAction<DeepPartial<PersonalInfoFormData>>) => {
      smartUpdate(state.personalInfo, action.payload);
    },
    updateDriverAndCar: (state, action: PayloadAction<DeepPartial<DriverAndCarFormData>>) => {
      smartUpdate(state.driverAndCar, action.payload);
    },
    updateWorkAuth: (state, action: PayloadAction<DeepPartial<WorkAuthorizationFormData>>) => {
      smartUpdate(state.workAuth, action.payload);
    },
    updateContacts: (state, action: PayloadAction<DeepPartial<ContactFormData>>) => {
      smartUpdate(state.contacts, action.payload);
    },
    resetEmployeeFormForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOnboardingSubmission.pending, (state) => {
        state.requestStatus = 'pending';
      })
      .addCase(postOnboardingSubmission.fulfilled, (state, action) => {
        state.requestStatus = 'succeeded';
        console.log(action.payload);
      })
      .addCase(postOnboardingSubmission.rejected, (state, action) => {
        state.requestStatus = 'failed';
        console.log(action.payload);
      });
  },
});

export const {
  updateFormsWithEmployee,
  updatePersonalInfo,
  updateDriverAndCar,
  updateWorkAuth,
  updateContacts,
} = employeeFormSlice.actions;
export default employeeFormSlice.reducer;
