import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const ClientSegBrok = createAsyncThunk(
  "ClientBrokerage/ClientSegBrok",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.ClientSegmentBrok(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
