import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const UnblockUsers = createAsyncThunk(
  "UnblockUserRecord/UnblockUsers",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.UnblockUser(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
