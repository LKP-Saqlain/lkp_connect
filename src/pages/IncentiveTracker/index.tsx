import { useEffect } from "react";
import { encryptAES } from "../../utils/encryptDecrypt"; // adjust path if needed

const NEW_APP_BASE_URL = import.meta.env.VITE_NEW_APP_BASE_URL;

const IncentiveTracker = () => {
  useEffect(() => {
    const token = localStorage.getItem("tkn");
    const userId = localStorage.getItem("Id");
    const userType = localStorage.getItem("uIdType");

    if (!token || !userId || !userType) {
      console.error(
        "Missing session values, cannot redirect to Incentive Tracker",
      );
      return;
    }

    const payload = JSON.stringify({
      token,
      user_id: userId,
      user_type: userType,
    });

    const encryptedPayload = encryptAES(payload);

    const params = new URLSearchParams({
      data: encryptedPayload,
    });

    // Open in a new tab instead of navigating the current one
    window.open(`${NEW_APP_BASE_URL}?${params.toString()}`, "_blank");
  }, []);

  return <div>Redirecting to Incentive Tracker...</div>;
};

export default IncentiveTracker;
