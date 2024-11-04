import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const fetchDormantReport = createAsyncThunk(
  "dormantReport/fetchDormantReport",
  async (payload: any, { rejectWithValue }) => {
    try {
      //   const response = await apiService(
      //     "POST",
      //     endpoints.getDormantReport,
      //     payload
      //   );

      const response = await apiServices.getDormantReport(payload);
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
