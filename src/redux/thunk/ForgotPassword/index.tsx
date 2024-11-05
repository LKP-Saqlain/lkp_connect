import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const SendOtp = createAsyncThunk(
  "resendUserOtp/SendOtp",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.sendOtp(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ForgotUserPassword = createAsyncThunk(
  "resendUserOtp/ForgotUserPassword",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.forgetPassword(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
