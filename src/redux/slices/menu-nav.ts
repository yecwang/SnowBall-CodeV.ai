import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isOpen: true,
};

export const menuNavSlice = createSlice({
  name: 'menu-nav',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<{ isOpen: boolean }>) => {
      console.log('state...', {
        ...state,
        ...action.payload,
      });
      
      return {
        ...state,
        ...action.payload,
      }
    },
  },
});

export default menuNavSlice.reducer;

export const { actions } = menuNavSlice;
