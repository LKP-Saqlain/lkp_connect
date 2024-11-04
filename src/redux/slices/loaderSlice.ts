import { createSlice } from "@reduxjs/toolkit";

interface LoaderState {
  loading: boolean;
  message: "";
}

const initialState: LoaderState = {
  loading: false,
  message: "",
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader(state, action) {
      state.loading = true;
      state.message = action.payload;
    },
    hideLoader(state) {
      state.loading = false;
      state.message = "";
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
