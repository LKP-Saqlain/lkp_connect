import { createSlice } from "@reduxjs/toolkit";
import { ClientSegBrok } from "../../thunk/ClientSegmentBrokerage";

interface ClientBrokInterface {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: ClientBrokInterface = {
  data: [],
  loading: false,
  error: null,
};

const ClientSegmentBrokerage = createSlice({
  name: "ClientBrokerage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ClientSegBrok.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ClientSegBrok.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(ClientSegBrok.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default ClientSegmentBrokerage.reducer;
