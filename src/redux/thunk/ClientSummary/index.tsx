import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const ClientSummary = createAsyncThunk(
  "Summary/ClientSummary",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.GetClientStatusCnt(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
