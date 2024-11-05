import { createSlice } from "@reduxjs/toolkit";
import { SendOtp, ForgotUserPassword } from "../../thunk/ForgotPassword";

interface ForgotPassowrd {
  data: any;
  loading: boolean;
  error: string | null;
  forgotPassUserData: any;
  forgotloading: boolean;
  forgoterror: string | null;
}

const initialState: ForgotPassowrd = {
  data: null,
  loading: false,
  error: null,
  forgotPassUserData: null,
  forgotloading: false,
  forgoterror: null,
};

const LoginPageSlice = createSlice({
  name: "resendUserOtp",
  initialState,
  reducers: {
    // Optional: If you need some synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(SendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(SendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(ForgotUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ForgotUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(ForgotUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default LoginPageSlice.reducer;
