import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store"; // Adjust path as needed
import CustomModal from "../../../components/common/DPModal"; // Adjust path as needed

const SessionExpiryHandler = () => {
  const [modal_center, setModalCenter] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const location = useLocation();
  const { data } = useSelector((state: RootState) => state.UserLogin);
  const tokenExpiryTime = data?.data?.tokenExpiryTime;

  const checkTokenExpiry = (expiryTime: string) => {
    if (!expiryTime) return false;
    return new Date() >= new Date(expiryTime);
  };

  useEffect(() => {
    if (tokenExpiryTime) {
      const expired = checkTokenExpiry(tokenExpiryTime);
      if (expired && location.pathname === "/dashboard") {
        setIsTokenExpired(true);
        setModalCenter(true);
      } else {
        setIsTokenExpired(false);
      }
    }
  }, [data, location.pathname]);

  return (
    isTokenExpired && (
      <CustomModal
        tog_center={() => setModalCenter(false)}
        modal_center={modal_center}
        setmodal_center={setModalCenter}
        Msg="Your session has expired!"
        expiredtime={true}
      />
    )
  );
};

export default SessionExpiryHandler;
