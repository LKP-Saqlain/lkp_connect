import { createSlice } from "@reduxjs/toolkit";
import { UserLogin } from "../../thunk/Login/login";

interface UserLoginPage {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserLoginPage = {
  data: [],
  loading: false,
  error: null,
};

const LoginPageSlice = createSlice({
  name: "Login",
  initialState,
  reducers: {
    updateUserId: (state, action) => {
      if (state.data && typeof state.data === "object") {
        console.log("state.data", state.data, "action.payload", action.payload);
        state.data.data.user_id = action.payload;
      }
    },
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
export const { updateUserId } = LoginPageSlice.actions;
export default LoginPageSlice.reducer;
