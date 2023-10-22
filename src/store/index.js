import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import transactSlice from './slice/transactSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    transact: transactSlice,
  },
});

