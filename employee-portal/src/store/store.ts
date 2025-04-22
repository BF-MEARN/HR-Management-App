import { configureStore } from '@reduxjs/toolkit';

import employeeFormReducer from './slices/employeeFormSlice';

export const store = configureStore({
  reducer: {
    employeeForm: employeeFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
