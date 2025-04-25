import { configureStore } from '@reduxjs/toolkit';

import employeeFormReducer from './slices/employeeFormSlice';
import employeeReducer from './slices/employeeSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    employeeForm: employeeFormReducer,
    user: userReducer,
    employee: employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
