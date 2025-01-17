import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TNavDialog = {
  operation: string | null;
  isOpen: boolean;
  pageID?: string;
}
const initialState: TNavDialog = {
  isOpen: false,
  operation: '',
};

const slice = createSlice({
  name: 'nav-dialog',
  initialState,
  reducers: {
    updateNavDialog: (state, action: PayloadAction<Omit<TNavDialog, 'isOpen'> & { isOpen?: boolean }>) => ({
      ...state,
      ...action.payload,
    }),
    toggleDialogStatus: (state) => {
      state.isOpen = !state.isOpen;
    },
  }
});

export const { updateNavDialog, toggleDialogStatus } = slice.actions;

export default slice.reducer;
