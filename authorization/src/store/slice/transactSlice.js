import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  operations: [],
};

const transactSlice = createSlice({
  name: 'transact',
  initialState,
  reducers: {
    setOperations(state, action) {
      state.operations = action.payload;
    },
    addOperation(state, action) {
      state.operations.push(action.payload);
    },
    removeOperations(state){
      state.operations = [];
    }
  },
});

export const { setOperations, addOperation, removeOperations } = transactSlice.actions;

export default transactSlice.reducer;
