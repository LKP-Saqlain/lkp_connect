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
import Maintenance from "./pages/Maintenance";
import AmcMembershipSteps from "./pages/AmcMembership/Steps";
import StatusCard from "./pages/MutualFund/PhysicalOnboard/StatusPage";
import { useAppHealth } from "./hooks/useAppHealth";

const LoginPage = lazy(() => import("./pages/Authentication/Login"));
const AuthenticateUser = lazy(
  () => import("./pages/Authentication/authnticateUser")
);
const ForgotPassword = lazy(
  () => import("./pages/Authentication/ForgotPassword")
);
const SideBar = lazy(() => import("./components/sideBar"));
const DpMandate = lazy(() => import("./pages/Masters/MandateCall"));
const FetchMTFActivation = lazy(() => import("./pages/MTF"));
const ConsentOtp = lazy(() => import("./pages/MTF/consentOtp"));
const CongratsPage = lazy(() => import("./pages/MTF/congratsScreen"));

const App = () => {
  //this used to check the health of my IIS Server
  const { serverOnline, updateAvailable } = useAppHealth();

  if (!serverOnline) {
    return <Maintenance />;
  }
  return (
    <Router>
      {updateAvailable && (
        <div className="update-banner">
          A new version is available.
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )}
      <ToastContainer />
      <Loader />
      <SessionExpiryHandler />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/authorization"
            element={<PrivateRoute authElement={<AuthenticateUser />} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/change-password"
            element={<PrivateRoute authElement={<ChangePassword />} />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute customLogin={false} dashElement={<SideBar />} />
            }
          />
          <Route
            path="/AmcMembership"
            element={
              <PrivateRoute
                customLogin={false}
                dashElement={<AmcMembershipSteps />}
              />
            }
          />
          {/* <Route
            path="/DPMandate"
            element={
              <PrivateRoute customLogin={false} dashElement={<DpMandate />} />
            }
          />
          <Route
            path="/DPMandate/:encryptedCode"
            element={
              <PrivateRoute customLogin={false} dashElement={<DpMandate />} />
            }
          /> */}
          <Route path="/DPMandate" element={<DpMandate />} />
          <Route path="/DPMandate/:encryptedCode" element={<DpMandate />} />
          <Route path="/AMCLink" element={<AmcMembershipSteps />} />
          <Route
            path="/PhysicalStats/:encryptedCode"
            element={<StatusCard />}
          />
          <Route
            path="/MTFSegmentActivation"
            element={
              <PrivateRoute
                customLogin={false}
                dashElement={<FetchMTFActivation />}
              />
            }
          />
          <Route
            path="/otp"
            element={
              <PrivateRoute customLogin={false} dashElement={<ConsentOtp />} />
            }
          />
          <Route
            path="/congratulations"
            element={
              <PrivateRoute
                customLogin={false}
                dashElement={<CongratsPage />}
              />
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
