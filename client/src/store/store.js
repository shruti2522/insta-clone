import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice'; // Import your authSlice here

const store = configureStore({
  reducer: {
    auth: authReducer, // Add your authSlice to the store
    // Add other reducers here if needed
  },
});

export default store;