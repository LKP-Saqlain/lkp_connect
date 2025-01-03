import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const ClientUserDetails = createAsyncThunk(
  "ClientDetailSlice/ClientUserDetails",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.ClientDashboard(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
