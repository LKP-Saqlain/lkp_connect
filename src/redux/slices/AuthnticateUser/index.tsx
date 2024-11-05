import { createSlice } from "@reduxjs/toolkit";
import { AuthUser } from "../../thunk/AuthUser";

interface AuthUser {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthUser = {
  data: [],
  loading: false,
  error: null,
};

const AuthnticateUserSlice = createSlice({
  name: "AuthnticateUser",
  initialState,
  reducers: {
    // Optional: If you need some synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(AuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(AuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default AuthnticateUserSlice.reducer;
