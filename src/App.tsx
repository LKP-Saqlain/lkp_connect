import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
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

const LoginPage = lazy(() => import("./pages/Authentication/Login"));
const AuthenticateUser = lazy(
  () => import("./pages/Authentication/authnticateUser")
);
const ForgotPassword = lazy(
  () => import("./pages/Authentication/ForgotPassword")
);
const SideBar = lazy(() => import("./components/sideBar"));
const DpMandate = lazy(() => import("./pages/Masters/MandateCall"));

const App = () => {
  const [serverOnline, setServerOnline] = useState(true);
  const retryIntervalRef = useRef<NodeJS.Timeout | null>(null);

  //this used to check the health of my IIS Server
  const checkServer = async () => {
    try {
      const res = await fetch("/favicon.png", { cache: "no-store" });
      if (res.ok) {
        if (!serverOnline) {
          console.log("✅ Server back online — reloading...");
          setServerOnline(true);
          window.location.reload();
        }
      } else {
        console.warn("⚠️ Server returned bad status");
        setServerOnline(false);
      }
    } catch (err) {
      console.error("❌ Server unreachable:", err);
      setServerOnline(false);
    }
  };

  useEffect(() => {
    checkServer();
  }, []);

  useEffect(() => {
    if (!serverOnline) {
      console.log("🔁 Starting retry interval...");
      retryIntervalRef.current = setInterval(() => {
        checkServer();
      }, 10000);
    } else {
      if (retryIntervalRef.current) {
        console.log("🛑 Stopping retry interval...");
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    }

    return () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
      }
    };
  }, [serverOnline]);

  if (!serverOnline) {
    return <Maintenance />;
  }

  return (
    <Router>
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
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
