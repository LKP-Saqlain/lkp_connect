import { createSlice } from "@reduxjs/toolkit";
import { DealerPerformance } from "../../thunk/DealerPerformance";

interface DealerPerformance {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: DealerPerformance = {
  data: [],
  loading: false,
  error: null,
};

const DealerPerformanceSlice = createSlice({
  name: "RevenueSummary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(DealerPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DealerPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(DealerPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default DealerPerformanceSlice.reducer;
