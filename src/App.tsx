import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import LoginPage from "./pages/Authentication/Login";
import AuthenticateUser from "./pages/Authentication/authnticateUser";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import SideBar from "./components/sideBar";
import "./assets/scss/themes.scss";
import PrivateRoute from "./components/PrivateRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./components/hooks";

import Loader from "./components/common/Loader";

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Header />
        <Loader />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/authorization" element={<AuthenticateUser />} /> */}
          <Route
            path="/authorization"
            element={<PrivateRoute authElement={<AuthenticateUser />} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute customLogin={false} dasheElement={<SideBar />} />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
