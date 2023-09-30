
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  user: null,
  error: null,
  loading: false,
};

export const logIn = createAsyncThunk(process.env.REACT_APP_BACKEND_URL + "/auth/login", async ({email,password}) => {
  try {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
    const responseData = await response.json();
    const token = responseData.data.token; 
    
    Cookies.set('authToken', token, { expires: 7 }); 

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

const loginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.error.message;
      });
  },
});

export default loginSlice.reducer;
