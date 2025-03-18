import { useEffect, useState, useRef } from "react";
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
  // console.log(data);

  const tokenExpiryTime = data?.data?.tokenExpiryTime;
  // const tokenExpiryTime = new Date(Date.now() + 60000).toISOString();

  const timerRef = useRef<NodeJS.Timeout | null>(null); // Track timeout

  useEffect(() => {
    if (!tokenExpiryTime) return;

    const expiryTimestamp = new Date(tokenExpiryTime).getTime();
    const currentTimestamp = Date.now();
    const timeUntilExpiry = expiryTimestamp - currentTimestamp;

    // // Function to format the time left into a readable format
    // const formatTimeLeft = (time: number): string => {
    //   const seconds = Math.floor((time / 1000) % 60);
    //   const minutes = Math.floor((time / 1000 / 60) % 60);
    //   const hours = Math.floor(time / 1000 / 60 / 60);
    //   return `${hours}h ${minutes}m ${seconds}s`;
    // };

    // Clear existing timer (prevents multiple timeouts)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (timeUntilExpiry > 0) {
      // Update the time left every second
      // const intervalId = setInterval(() => {
      //   const timeLeft = expiryTimestamp - Date.now();
      //   console.log("Time left:", formatTimeLeft(timeLeft)); // Log countdown to the console

      //   if (timeLeft <= 0) {
      //     clearInterval(intervalId);
      //     if (location.pathname === "/dashboard") {
      //       setIsTokenExpired(true);
      //       setModalCenter(true);
      //     }
      //   }
      // }, 1000);

      timerRef.current = setTimeout(() => {
        if (location.pathname === "/dashboard") {
          setIsTokenExpired(true);
          setModalCenter(true);
        }
        // clearInterval(intervalId); // Clean up the interval when token expires
      }, timeUntilExpiry);
    } else {
      if (location.pathname === "/dashboard") {
        setIsTokenExpired(true);
        setModalCenter(true);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // clearInterval(timerRef.current as NodeJS.Timeout); // Clean up interval
    };
  }, [tokenExpiryTime, location.pathname]);

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
