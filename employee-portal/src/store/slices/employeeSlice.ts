import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { api } from '../../utils/utils';
import { Employee } from './employeeTypes';

export const fetchEmployeeData = createAsyncThunk(
  'employee/personal-info',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api('/employee/personal-info');

      if (!res.ok) {
        return rejectWithValue(`employee/personal-info: ${res.status}`);
      }
      return await res.json();
    } catch (e) {
      console.error('employee/personal-info:', e);
      return rejectWithValue('Network or server error');
    }
  }
);

export interface EmployeeState {
  employee: Employee | null;
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: EmployeeState = {
  employee: null,
  status: 'idle',
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    resetEmployee: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeData.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchEmployeeData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employee = action.payload['employee'];
      })
      .addCase(fetchEmployeeData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
