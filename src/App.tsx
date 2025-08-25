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
    console.log("testing console", wasOffline);

    const id = setInterval(checkServer, 10000);
    return () => clearInterval(id);
  }, [serverOnline]);

  if (!serverOnline) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f3f3f3",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
          We’ll be back soon!
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
          Sorry for the inconvenience but we’re performing some maintenance at
          the moment. <br />
          If you need to you can always contact us, otherwise we’ll be back
          online shortly!
        </p>
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>—Team WebPortal</p>
      </div>
    );
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
