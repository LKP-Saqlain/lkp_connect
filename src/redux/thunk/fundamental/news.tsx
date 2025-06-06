import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiServices } from "../../../services";

export const fetchFundamentalNewsfeed = createAsyncThunk(
  "news/fetchFundamentalNewsfeed",
  async (isin: string, { rejectWithValue }) => {
    try {
      //   debugger;
      const response = await apiServices.getFundamentalNewsfeed(isin);
      console.log(
        "response-->",
        "CurrentISIN",
        isin,
        response?.data?.body?.newsList
      );
      const data = response?.data?.body?.newsList ?? [];
      return { isin, data };
    } catch (error: any) {
      return rejectWithValue(error?.message || "Error fetching news");
    }
  }
);
