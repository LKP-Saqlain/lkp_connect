import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const GetMenu = createAsyncThunk(
  "Menu/GetMenu",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.dashGetMenus(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
