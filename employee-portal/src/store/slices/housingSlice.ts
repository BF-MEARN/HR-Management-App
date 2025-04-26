import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  contactInfo: {
    cellPhone: string;
  };
}

export interface HousingState {
  _id: string;
  address: {
    building?: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  landlord: {
    fullName?: string;
    phone: string;
    email: string;
  };
  facility: {
    beds?: number;
    mattresses?: number;
    tables?: number;
    chairs?: number;
  };
  residents: Employee[];
}

const initialState: HousingState = {
  _id: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
  landlord: {
    phone: '',
    email: '',
  },
  facility: {},
  residents: [],
};

const housingSlice = createSlice({
  name: 'housing',
  initialState,
  reducers: {
    getHousing: (_, action: PayloadAction<HousingState>) => {
      return action.payload;
    },
  },
});

export const { getHousing } = housingSlice.actions;
export default housingSlice.reducer;
