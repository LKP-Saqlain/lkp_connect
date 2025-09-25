import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import PrivateRoute from "./components/PrivateRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import Loader from "./components/common/Loader";
import "./assets/scss/themes.scss";
import SessionExpiryHandler from "./pages/Authentication/sessionExpiryHandler";
import "./Global.css";
import ChangePassword from "./pages/Authentication/ChangePassword";
import Maintenance from "./pages/Maintenance";

const LoginPage = lazy(() => import("./pages/Authentication/Login"));
const AuthenticateUser = lazy(
  () => import("./pages/Authentication/authnticateUser")
);
const ForgotPassword = lazy(
  () => import("./pages/Authentication/ForgotPassword")
);
const SideBar = lazy(() => import("./components/sideBar"));

const App = () => {
  const [serverOnline, setServerOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const checkServer = () => {
      console.log("add all");

      fetch("/favicon.png", { cache: "no-store" })
        .then((res) => {
          if (res.ok) {
            if (!serverOnline) {
              window.location.reload();
            }
            setServerOnline(true);
          } else {
            setServerOnline(false);
            setWasOffline(true);
          }
        })
        .catch(() => {
          setServerOnline(false);
          setWasOffline(true);
        });
    };

    checkServer();
    console.log("new commented code all", wasOffline);

    const id = setInterval(checkServer, 10000);
    return () => clearInterval(id);
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
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
