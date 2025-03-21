import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage as the default storage
import loaderReducer from "./slices/loaderSlice";
// import dormantReportReducer from "./slices/Reports/dormantReport";
import LoginReducer from "./slices/Login/login";
import AuthnticateUser from "./slices/AuthnticateUser";
import ForgotPassword from "./slices/ForgotPassword";
import Overview from "./slices/Overview";
import DashMenuReducer from "./slices/GetMenus";
import ClientSummaryReducer from "./slices/ClientSummary";
import DealerPerformance from "./slices/DealerPerformance";
import ClientUserDetails from "./slices/ClientUserDetails";
import ClientSegmentBrokerage from "./slices/ClientSegmentBrokerage";

// Configure the persist settings
const persistConfig = {
  key: "root",
  storage,
};

// Wrap your root reducer with persistReducer
const persistedLoginReducer = persistReducer(persistConfig, LoginReducer);
const persistedAuthReducer = persistReducer(persistConfig, AuthnticateUser);

const store = configureStore({
  reducer: {
    loader: loaderReducer,
    UserLogin: persistedLoginReducer,
    AuthUser: persistedAuthReducer,
    ForgotUser: ForgotPassword,
    userOverView: Overview,
    UserMenu: DashMenuReducer,
    ClientSummary: ClientSummaryReducer,
    RevenueSummary: DealerPerformance,
    ClientUserDashboardDetails: ClientUserDetails,
    ClientSegmentBrokerageDetails: ClientSegmentBrokerage,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disables serializable check
    }),
  devTools: import.meta.env.VITE_NODE_ENV === "development",
});

export const persistor = persistStore(store); // Create the persistor

if (import.meta.env.VITE_NODE_ENV === "production") {
  console.log = () => {};
}

if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => {};
}
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
