import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../../services";

export const APBrokerage = createAsyncThunk(
  "Overview/APBrokerage",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.GetAPRevenue(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
