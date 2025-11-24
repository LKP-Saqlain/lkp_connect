import { useDispatch } from "react-redux";
import { Card } from "reactstrap";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useEffect } from "react";
import { Button } from "rsuite";

const PhysicalOnboard = ({ ClientCode, onPhysicalOnboard }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const ClientInfo = async () => {
    try {
      dispatch(showLoader("feteching Client Code..."));

      const response = await fetch(
        `https://middlewareapi.lkp.net.in/api/MF/PhysicalClientInfo?ClientCode=${ClientCode}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      const data = await response.json();
      console.log(data?.data, "PhysicalOnboard Data");

      dispatch(hideLoader());
    } catch (error) {
      console.error(error);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (ClientCode) ClientInfo();
  }, [ClientCode]);

  return (
    <Card sx={{ borderRadius: 4, p: 2, mb: 3 }}>
      PhysicalOnboard
      <Button onClick={onPhysicalOnboard}>back</Button>
    </Card>
  );
};

export default PhysicalOnboard;
