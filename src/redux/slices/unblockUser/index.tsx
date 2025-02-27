import { createSlice } from "@reduxjs/toolkit";
import { UnblockUsers } from "../../thunk/unblockUser/unblockUser";

interface UnblockUserPage {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: UnblockUserPage = {
  data: [],
  loading: false,
  error: null,
};

const LoginPageSlice = createSlice({
  name: "UnblockUserRecord",
  initialState,
  reducers: {
    // Optional: If you need some synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(UnblockUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UnblockUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(UnblockUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default LoginPageSlice.reducer;
