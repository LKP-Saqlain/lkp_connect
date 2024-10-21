import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./slices/loaderSlice";
import dormantReportReducer from "./slices/Reports/dormantReport";
import LoginReducer from "./slices/Login/login";

const store = configureStore({
  reducer: {
    loader: loaderReducer,
    // dormantReport: dormantReportReducer,
    // UserLogin: LoginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
