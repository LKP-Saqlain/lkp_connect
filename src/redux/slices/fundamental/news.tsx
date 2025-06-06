import { createSlice } from "@reduxjs/toolkit";

import { fetchFundamentalNewsfeed } from "../../thunk/fundamental/news";

interface NewsState {
  currentIsin: string | null;
  currentNews: {
    data: any[];
    lastUpdated: string | null;
  };
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  currentIsin: null,
  currentNews: {
    data: [],
    lastUpdated: null,
  },
  loading: false,
  error: null,
};

const newsSlice = createSlice({
  name: "news/fetchFundamentalNewsfeed",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFundamentalNewsfeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFundamentalNewsfeed.fulfilled, (state, action) => {
        const { isin, data } = action.payload;
        console.log("currentISIN", isin, "currentData", data);

        state.currentIsin = isin;

        // Always update currentNews — even if empty
        state.currentNews = {
          data, // can be [] if API returned empty
          lastUpdated: new Date().toISOString(),
        };

        state.loading = false;
      })
      .addCase(fetchFundamentalNewsfeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default newsSlice.reducer;
