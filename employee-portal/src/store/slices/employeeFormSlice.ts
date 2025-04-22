import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
  ContactFormData,
  DriverAndCarFormData,
  PersonalInfoFormData,
  WorkAuthorizationFormData,
  emptyContactFormData,
  emptyDriverAndCarFormData,
  emptyPersonalInfoFormData,
  emptyWorkAuthorizationFormData,
} from './employeeFormTypes';
import { DeepPartial, smartUpdate } from './utils';

export interface EmployeeFormState {
  personalInfo: PersonalInfoFormData;
  driverAndCar: DriverAndCarFormData;
  workAuth: WorkAuthorizationFormData;
  contacts: ContactFormData;
}

const initialState: EmployeeFormState = {
  personalInfo: emptyPersonalInfoFormData,
  driverAndCar: emptyDriverAndCarFormData,
  workAuth: emptyWorkAuthorizationFormData,
  contacts: emptyContactFormData,
};

const employeeFormSlice = createSlice({
  name: 'employeeForm',
  initialState,
  reducers: {
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
    resetOnboardingForm: () => initialState,
  },
});

export const {
  updatePersonalInfo,
  updateDriverAndCar,
  updateWorkAuth,
  resetOnboardingForm,
  updateContacts,
} = employeeFormSlice.actions;
export default employeeFormSlice.reducer;
