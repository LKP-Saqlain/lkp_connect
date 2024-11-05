import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const DealerPerformance = createAsyncThunk(
  "RevenueSummary/DealerPerformance",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.DealerPerformance(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
