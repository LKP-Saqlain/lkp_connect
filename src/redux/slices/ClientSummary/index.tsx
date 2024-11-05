import { createSlice } from "@reduxjs/toolkit";
import { ClientSummary } from "../../thunk/ClientSummary";

interface clientSummary {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: clientSummary = {
  data: [],
  loading: false,
  error: null,
};

const ClientSummarySlice = createSlice({
  name: "Summary",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ClientSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ClientSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(ClientSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default ClientSummarySlice.reducer;
