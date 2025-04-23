import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '../../utils/utils';

export const fetchMe = createAsyncThunk('user/me', async (_, { rejectWithValue }) => {
  try {
    const res = await api('/user/me');
    if (!res.ok) {
      return rejectWithValue(`Fetch user/me: ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    console.error('Fetch user/me:', e);
    return rejectWithValue('Network or server error');
  }
});

export interface UserEntry {
  username: string;
  email: string;
  employeeId: string;
}

export interface UserState {
  entry: UserEntry | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: UserState = { entry: null, status: 'idle' };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserEntry | null>) => {
      state.entry = action.payload;
    },
    resetUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entry = action.payload['user'];
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = 'failed';
        state.entry = null;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
