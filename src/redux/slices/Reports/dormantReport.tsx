import { createSlice } from "@reduxjs/toolkit";
import { fetchDormantReport } from "../../thunk/Reports/dormantReport";

interface DormantReportState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: DormantReportState = {
  data: null,
  loading: false,
  error: null,
};

const dormantReportSlice = createSlice({
  name: "dormantReport",
  initialState,
  reducers: {
    // Optional: If you need some synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDormantReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDormantReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDormantReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default dormantReportSlice.reducer;
