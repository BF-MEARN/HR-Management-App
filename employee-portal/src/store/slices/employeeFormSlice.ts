import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { DeepPartial, api, formatDateString, smartUpdate } from '../../utils/utils';
import { RootState } from '../store';
import {
  ContactFormData,
  DriverAndCarFormData,
  EmployeeFormPayload,
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
import {
  updateEmployeeAddress,
  updateEmployeeContactInfo,
  updateEmployeeEmergencyContact,
  updateEmployeeEmploymentInfo,
  updateEmployeeName,
} from './employeeUpdateThunks';

export interface EmployeeFormState {
  personalInfo: PersonalInfoFormData;
  driverAndCar: DriverAndCarFormData;
  workAuth: WorkAuthorizationFormData;
  contacts: ContactFormData;
  requestStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  requestError?: string;
  updateCounter: number;
}

const initialState: EmployeeFormState = {
  personalInfo: emptyPersonalInfoFormData,
  driverAndCar: emptyDriverAndCarFormData,
  workAuth: emptyWorkAuthorizationFormData,
  contacts: emptyContactFormData,
  requestStatus: 'idle',
  updateCounter: 0,
};

export const postOnboardingSubmission = createAsyncThunk(
  'employee/onboarding/',
  async (_, { getState, rejectWithValue }) => {
    const { employeeForm: forms } = getState() as RootState;
    const payload: EmployeeFormPayload = {
      firstName: forms.personalInfo.firstName,
      lastName: forms.personalInfo.lastName,
      middleName: forms.personalInfo.middleName,
      preferredName: forms.personalInfo.preferredName,
      profilePicture: forms.personalInfo.profilePicture?.s3Key, // TODO: replace with s3
      ssn: forms.personalInfo.ssn,
      dob: forms.personalInfo.dob,
      address: forms.personalInfo.address,
      gender: forms.personalInfo.gender,
      contactInfo: {
        cellPhone: forms.personalInfo.cellPhone,
        workPhone: forms.personalInfo.workPhone,
      },
      driverLicense: forms.driverAndCar.hasDriverLicense
        ? {
            number: forms.driverAndCar.driverLicense.number,
            expirationDate: forms.driverAndCar.driverLicense.expirationDate,
            file: forms.driverAndCar.driverLicense.license.s3Key || '',
          }
        : undefined,

      carInfo: forms.driverAndCar.hasCar ? forms.driverAndCar.carInfo : undefined,
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
                file: forms.workAuth.extraAuthInfo.optReceipt?.s3Key, // TODO: replace with s3
              }
            : undefined,
      },
      reference: forms.contacts.hasReference ? forms.contacts.reference : undefined,
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
              previewUrl: '',
              s3Key: profilePicture,
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
                previewUrl: '',
                s3Key: driverLicense.file,
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
          optReceipt: visaInfo.optReceipt?.file
            ? {
                name: visaInfo.optReceipt?.file,
                previewUrl: '',
                s3Key: visaInfo.optReceipt?.file,
              }
            : undefined,
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
    resetEmployeeForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOnboardingSubmission.pending, (state) => {
        state.requestStatus = 'pending';
      })
      .addCase(postOnboardingSubmission.fulfilled, (state) => {
        state.requestStatus = 'succeeded';
      })
      .addCase(postOnboardingSubmission.rejected, (state) => {
        state.requestStatus = 'failed';
      })
      .addCase(updateEmployeeName.fulfilled, (state) => {
        state.updateCounter += 1;
      })
      .addCase(updateEmployeeAddress.fulfilled, (state) => {
        state.updateCounter += 1;
      })
      .addCase(updateEmployeeContactInfo.fulfilled, (state) => {
        state.updateCounter += 1;
      })
      .addCase(updateEmployeeEmploymentInfo.fulfilled, (state) => {
        state.updateCounter += 1;
      })
      .addCase(updateEmployeeEmergencyContact.fulfilled, (state) => {
        state.updateCounter += 1;
      });
  },
});

export const {
  updateFormsWithEmployee,
  updatePersonalInfo,
  updateDriverAndCar,
  updateWorkAuth,
  updateContacts,
  resetEmployeeForm,
} = employeeFormSlice.actions;
export default employeeFormSlice.reducer;
