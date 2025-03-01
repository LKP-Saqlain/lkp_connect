import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import PrivateRoute from "./components/PrivateRoutes";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import Loader from "./components/common/Loader";
import "./assets/scss/themes.scss";
import CustomModal from "./components/common/DPModal";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

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
  const [modal_center, setModalCenter] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  // const tog_center = () => setModalCenter(!modal_center);

  const { data } = useSelector((state: RootState) => state.UserLogin);
  const tokenExpiryTime = data?.data?.tokenExpiryTime;

  const checkTokenExpiry = (expiryTime: string) => {
    debugger;
    if (!expiryTime) return false;
    return new Date() <= new Date(expiryTime);
  };

  useEffect(() => {
    if (tokenExpiryTime) {
      const expired = checkTokenExpiry(tokenExpiryTime);
      setIsTokenExpired(expired);
      if (expired) {
        setModalCenter(true);
      }
    }
  }, [data]);

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
          <Route
            path="/dashboard"
            element={
              <PrivateRoute customLogin={false} dashElement={<SideBar />} />
            }
          />
        </Routes>
      </Suspense>
      {isTokenExpired && (
        <CustomModal
          tog_center={() => setModalCenter(false)}
          modal_center={modal_center}
          setmodal_center={setModalCenter}
          Msg="Your session has expired!"
          expiredtime={true}
        />
      )}
    </Router>
  );
};

export default App;
