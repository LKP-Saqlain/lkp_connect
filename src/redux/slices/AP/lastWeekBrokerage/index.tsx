import { createSlice } from "@reduxjs/toolkit";
import { APBrokerage } from "../../../thunk/AP/lastWeekBrokerage";

interface APBrokerage {
  data: any;
  loading: boolean;
  error: string | null;
  forgotPassUserData: any;
  forgotloading: boolean;
  forgoterror: string | null;
}

const initialState: APBrokerage = {
  data: null,
  loading: false,
  error: null,
  forgotPassUserData: null,
  forgotloading: false,
  forgoterror: null,
};

const APBrokerageSlice = createSlice({
  name: "APBrokerage",
  initialState,
  reducers: {
    // Optional: If you need some synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(APBrokerage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(APBrokerage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(APBrokerage.rejected, (state, action) => {
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
export default APBrokerageSlice.reducer;
