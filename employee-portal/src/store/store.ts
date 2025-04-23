import { configureStore } from '@reduxjs/toolkit';

import employeeFormReducer from './slices/employeeFormSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    employeeForm: employeeFormReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
