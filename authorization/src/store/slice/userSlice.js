import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  token: null,
  id: null,
  balance: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.balance = action.payload.balance;
    },
    addBalance(state, action) {
      state.balance = action.payload.balance;
    },
    subBalance(state, action) {
      state.balance = action.payload.balance;
    }
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
