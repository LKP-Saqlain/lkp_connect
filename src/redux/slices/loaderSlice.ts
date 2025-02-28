import { createSlice } from "@reduxjs/toolkit";

interface LoaderState {
  loading: boolean;
  message: "";
  activeRequests: number;
}

const initialState: LoaderState = {
  loading: false,
  message: "",
  activeRequests: 0,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    showLoader(state, action) {
      state.activeRequests += 1; // Increase count
      state.loading = true;
      state.message = action.payload;
    },
    hideLoader(state) {
      state.activeRequests = Math.max(state.activeRequests - 1, 0); // Decrease count
      state.loading = state.activeRequests > 0; // Keep loader if any request is still active
      if (state.activeRequests === 0) {
        state.message = ""; // Clear message only when all requests finish
      }
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
