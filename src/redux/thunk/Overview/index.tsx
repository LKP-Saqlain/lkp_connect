import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const userOverview = createAsyncThunk(
  "Overview/userOverview",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.Last7dayBrokerage(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const ForgotUserPassword = createAsyncThunk(
//   "resendUserOtp/ForgotUserPassword",
//   async (payload: any, { rejectWithValue }) => {
//     try {
//       const response = await apiServices.forgetPassword(payload);
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
