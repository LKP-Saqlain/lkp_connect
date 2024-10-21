import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";
import { endpoints } from "../../../services/endpoints";

export const UserLogin = createAsyncThunk(
  "Login/UserLogin",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiServices.Login(payload);
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
