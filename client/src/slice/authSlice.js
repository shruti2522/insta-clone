
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {SIGNUP_URL} from '../config/constants';

const initialState = {
  user: null,
  error: null,
  loading: false,
};

export const signUp = createAsyncThunk(SIGNUP_URL, async ({firstname,lastname,username,email,password}) => {
  try {
    const response = await fetch(SIGNUP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const responseData = await response.json();
    console.log(responseData.message);

    return responseData;
  } catch (error) {
    console.error("Error during sign up:", error);
    if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
    }
    throw error;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
