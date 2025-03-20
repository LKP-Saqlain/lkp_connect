import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateRoute from "./components/PrivateRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import Loader from "./components/common/Loader";
import "./assets/scss/themes.scss";
import SessionExpiryHandler from "./pages/Authentication/sessionExpiryHandler";
import "./Global.css";
import ChangePassword from "./pages/Authentication/ChangePassword";
// import "./App.css";

const LoginPage = lazy(() => import("./pages/Authentication/Login"));
const AuthenticateUser = lazy(
  () => import("./pages/Authentication/authnticateUser")
);
const ForgotPassword = lazy(
  () => import("./pages/Authentication/ForgotPassword")
);
// const UnblockUser = lazy(() => import("./pages/Authentication/UnblockUser"));
const SideBar = lazy(() => import("./components/sideBar"));

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Loader />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/authorization"
            element={<PrivateRoute authElement={<AuthenticateUser />} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute customLogin={false} dashElement={<SideBar />} />
            }
          />
        </Routes>
      </Suspense>
      <SessionExpiryHandler />
    </Router>
  );
};

export default App;
