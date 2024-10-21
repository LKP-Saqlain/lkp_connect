import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import LoginPage from "./pages/Authentication/Login";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import SideBar from "./components/sideBar";
import "./assets/scss/themes.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import Loader from "./components/common/Loader";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Loader />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route
            path="/Dashboard"
            element={<SideBar2 layoutType={"vertical"} />}
          /> */}
          <Route path="/Dashboard" element={<SideBar />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
