import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";

const IVR = ({ activeSubItem, activeClickCount, activeMenu }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { authenticationValue, user_id, user_type, token } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  useEffect(() => {
    console.log("Test123456", activeMenu);
  }, [activeMenu]);

  const handleOpenTab = () => {
    dispatch(showLoader("Please wait we will redirect you"));
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://middleware.lkp.net.in/IVR/Login/SSOLogin";
    form.target = "_blank";

    const numericUserId = user_id.split("-")[1];

    const payload = {
      User_id: numericUserId,
      User_type: user_type,
      Auth_value: authenticationValue,
      accessToken: token,
    };
    console.log("IVRpayload", payload);

    Object.entries(payload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    dispatch(hideLoader());
  };
  useEffect(() => {
    console.log("activeSubItemTest", activeSubItem, activeClickCount);

    if (activeSubItem === "IVR Mapping") {
      handleOpenTab();
    }
  }, [activeSubItem, activeClickCount]);

  return <h5></h5>;
};

export default IVR;
