import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import CustomModal from "../../../components/common/DPModal";
import { isSetSessionExpired } from "../../../redux/slices/sessionExpired";
import "../style.css";

const SessionExpiryHandler = () => {
  const [modal_center, setModalCenter] = useState(false);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const { data } = useSelector((state: RootState) => state.UserLogin);
  const isNewUser = useSelector(
    (state: RootState) => state.isNewUser.isNewUser
  );
  const tokenExpiryTime = data?.data?.tokenExpiryTime;

  const excludedPaths = ["/", "/authorization"];

  useEffect(() => {
    const currentPath = location.pathname;

    const cameFromExcludedPath = excludedPaths.includes(
      prevPathRef.current || ""
    );

    if (
      isNewUser ||
      excludedPaths.includes(currentPath) ||
      cameFromExcludedPath
    ) {
      prevPathRef.current = currentPath;
      return;
    }

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

    prevPathRef.current = currentPath;
  }, [
    location.pathname,
    data?.data?.token,
    tokenExpiryTime,
    dispatch,
    isNewUser,
  ]);

  const shouldShowModal =
    !isNewUser &&
    isTokenExpired &&
    !excludedPaths.includes(location.pathname) &&
    !excludedPaths.includes(prevPathRef.current || "");

  return (
    shouldShowModal && (
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
