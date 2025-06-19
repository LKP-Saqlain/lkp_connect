import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store"; // Adjust path as needed
import CustomModal from "../../../components/common/DPModal"; // Adjust path as needed
import "../style.css";
import { isSetSessionExpired } from "../../../redux/slices/sessionExpired";
const SessionExpiryHandler = () => {
  const [modal_center, setModalCenter] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const location = useLocation();
  const { data } = useSelector((state: RootState) => state.UserLogin);
  const isNewUser = useSelector(
    (state: RootState) => state.isNewUser.isNewUser
  );
  console.log("IsNewUser", isNewUser);

  const dispatch = useDispatch<AppDispatch>();
  const tokenExpiryTime = data?.data?.tokenExpiryTime;

  useEffect(() => {
    if (isNewUser) return;
    if (data?.data?.token && tokenExpiryTime) {
      const expiryDate = new Date(tokenExpiryTime);
      const now = new Date();
      console.log("CurrentTime", now, "ExpiryTime", expiryDate);
      if (now > expiryDate) {
        setIsTokenExpired(true);
        setModalCenter(true);
        dispatch(isSetSessionExpired(true));
        return;
      }

      const timeUntilExpiry = expiryDate.getTime() - now.getTime();
      console.log("Testtest", timeUntilExpiry);

      const timer = setTimeout(() => {
        setIsTokenExpired(true);
        setModalCenter(true);
        dispatch(isSetSessionExpired(true));
      }, timeUntilExpiry);

      return () => clearTimeout(timer);
    }
  }, [data?.data?.token, tokenExpiryTime, dispatch, isNewUser]);

  return (
    !isNewUser &&
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
