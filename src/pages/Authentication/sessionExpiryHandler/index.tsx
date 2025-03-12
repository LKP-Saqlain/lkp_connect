import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store"; // Adjust path as needed
import CustomModal from "../../../components/common/DPModal"; // Adjust path as needed

const SessionExpiryHandler = () => {
  const [modal_center, setModalCenter] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const location = useLocation();
  const { data } = useSelector((state: RootState) => state.UserLogin);
  console.log(data);

  // const tokenExpiryTime = data?.data?.tokenExpiryTime;
  const tokenExpiryTime = new Date(Date.now() + 60000).toISOString();

  const timerRef = useRef<NodeJS.Timeout | null>(null); // Track timeout

  useEffect(() => {
    if (!tokenExpiryTime) return;

    const expiryTimestamp = new Date(tokenExpiryTime).getTime();
    const currentTimestamp = Date.now();
    const timeUntilExpiry = expiryTimestamp - currentTimestamp;

    // Clear existing timer (prevents multiple timeouts)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (timeUntilExpiry > 0) {
      timerRef.current = setTimeout(() => {
        if (location.pathname === "/dashboard") {
          setIsTokenExpired(true);
          setModalCenter(true);
        }
      }, timeUntilExpiry);
    } else {
      if (location.pathname === "/dashboard") {
        setIsTokenExpired(true);
        setModalCenter(true);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [tokenExpiryTime, location.pathname]);

  return (
    isTokenExpired &&
    location.pathname === "/dashboard" && (
      <CustomModal
        tog_center={() => setModalCenter(false)}
        modal_center={modal_center}
        setmodal_center={setModalCenter}
        Msg="Oops... It seems your session has expired!"
        expiredtime={true}
      />
    )
  );
};

export default SessionExpiryHandler;
