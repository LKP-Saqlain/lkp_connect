import { createSlice } from "@reduxjs/toolkit";
import { ClientUserDetails } from "../../thunk/ClientUserDetails";

interface ClientUserInfo {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: ClientUserInfo = {
  data: [],
  loading: false,
  error: null,
};

const ClientUserDetailSlice = createSlice({
  name: "ClientDetailSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ClientUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ClientUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(ClientUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default ClientUserDetailSlice.reducer;
