import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const AuthUser = createAsyncThunk(
  "AuthnticateUser/AuthUser",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.twoFactorAuthentication(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
