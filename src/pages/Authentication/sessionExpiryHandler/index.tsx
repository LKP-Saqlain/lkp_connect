import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store"; // Adjust path as needed
import CustomModal from "../../../components/common/DPModal"; // Adjust path as needed
import "../style.css";

const SessionExpiryHandler = () => {
  const [modal_center, setModalCenter] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const location = useLocation();
  const { data } = useSelector((state: RootState) => state.UserLogin);

  const tokenExpiryTime = data?.data?.tokenExpiryTime;
  // const tokenExpiryTime = new Date(Date.now() - 1 * 60 * 1000).toISOString(); //for testing
  // const istTime = new Date(tokenExpiryTime).toLocaleString("en-IN", {
  //   timeZone: "Asia/Kolkata",
  //   hour12: true,
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // });
  // console.log("IST Time:", istTime);

  useEffect(() => {
    if (tokenExpiryTime) {
      const expiryDate = new Date(tokenExpiryTime);
      const now = new Date();
      console.log("CurrentTime", now, "ExpiryTime", expiryDate);

      if (now > expiryDate) {
        setIsTokenExpired(true);
        setModalCenter(true);
        return;
      }

      const timeUntilExpiry = expiryDate.getTime() - now.getTime();
      console.log("timeUntilExpiry", timeUntilExpiry);

      const timer = setTimeout(() => {
        setIsTokenExpired(true);
        setModalCenter(true);
      }, timeUntilExpiry);

      return () => clearTimeout(timer);
    }
  }, [tokenExpiryTime]);

  return (
    isTokenExpired &&
    location.pathname === "/dashboard" && (
      <CustomModal
        tog_center={() => setModalCenter(false)}
        modal_center={modal_center}
        setmodal_center={setModalCenter}
        Msg="Oops! It looks like your session has expired."
        expiredtime={true}
      />
    )
  );
};

export default SessionExpiryHandler;
