import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserLogin } from "../../thunk/Login/login";

interface UserLoginPage {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserLoginPage = {
  data: null,
  loading: false,
  error: null,
};

const LoginPageSlice = createSlice({
  name: "Login",
  initialState,
  reducers: {
    // Optional: If you need some synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UserLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(UserLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export default LoginPageSlice.reducer;
