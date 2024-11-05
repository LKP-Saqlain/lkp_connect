import { createSlice } from "@reduxjs/toolkit";
import { userOverview } from "../../thunk/Overview";

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

const OverViewSlice = createSlice({
  name: "Overview",
  initialState,
  reducers: {
    // Optional: If you need some synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(userOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(userOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    //   .addCase(ForgotUserPassword.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(ForgotUserPassword.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.data = action.payload;
    //   })
    //   .addCase(ForgotUserPassword.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   });
  },
});
export default OverViewSlice.reducer;
