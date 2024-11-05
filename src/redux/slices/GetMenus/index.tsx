import { createSlice } from "@reduxjs/toolkit";
import { GetMenu } from "../../thunk/GetMenus";

interface userDashboardMenu {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: userDashboardMenu = {
  data: [],
  loading: false,
  error: null,
};

const GetUserMenus = createSlice({
  name: "Menu",
  initialState,
  reducers: {
    // Optional: If you need some synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(GetMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default GetUserMenus.reducer;
