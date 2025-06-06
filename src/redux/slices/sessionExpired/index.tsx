import { createSlice } from "@reduxjs/toolkit";

interface SessionState {
  data: { session?: boolean };
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  data: {},
  loading: false,
  error: null,
};

const IsSessionExpired = createSlice({
  name: "sessionExpired",
  initialState,
  reducers: {
    isSetSessionExpired: (state, action) => {
      console.log("state", state, "acttion--->", action);

      state.data.session = action.payload;
    },
  },
});

export const { isSetSessionExpired } = IsSessionExpired.actions;
export default IsSessionExpired.reducer;
