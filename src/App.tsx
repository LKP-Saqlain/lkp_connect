import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import LoginPage from "./pages/Authentication/Login";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import SideBar from "./components/sideBar";
import SideBar2 from "./pages/sideBarLayout";
import "./assets/scss/themes.scss";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const handleForgotClick = () => {
    console.log("Click from child");
  };
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/"
            element={<LoginPage handleForgotClick={handleForgotClick} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/Dashboard"
            element={<SideBar2 layoutType={"vertical"} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
