import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isNewUser: boolean;
}

const initialState: UserState = {
  isNewUser: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsNewUser: (state, action: PayloadAction<boolean>) => {
      state.isNewUser = action.payload;
    },
  },
});

export const { setIsNewUser } = userSlice.actions;
export default userSlice.reducer;
