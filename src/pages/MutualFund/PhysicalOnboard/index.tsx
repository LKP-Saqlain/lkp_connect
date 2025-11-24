import { useDispatch } from "react-redux";
import { Card } from "reactstrap";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useEffect, useState } from "react";
import { Button } from "rsuite";
import PrimaryHolder from "./PrimaryHolder";
import Nominee from "./Nominee";

const PhysicalOnboard = ({ ClientCode, onPhysicalOnboard }: any) => {
  const [data, setData] = useState<any>({});

  const dispatch = useDispatch<AppDispatch>();

  const ClientInfo = async () => {
    try {
      dispatch(showLoader("Fetching Client Code..."));

      const response = await fetch(
        `https://middlewareapi.lkp.net.in/api/MF/PhysicalClientInfo?ClientCode=${ClientCode}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      const data = await response.json();
      setData(data?.data);
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

  const updateNominee = ({ index, field, value }: any) => {
    setData((prev: any) => {
      const updated = { ...prev };

      const map: any = {
        name: `nominee${index}Name`,
        relationship: `nominee${index}Relationship`,
        applicable: `nominee${index}Applicable`,
        dob: `nominee${index}DOB`,
        minor: `nominee${index}MinorFlag`,
        guardian: `nominee${index}Guardian`,
        idType: `noM${index}_ID_TYP`,
        idNo: `noM${index}_IDNO`,
        email: `noM${index}_EMAIL`,
        mobile: `noM${index}_MOB`,
        address1: `noM${index}_ADD1`,
        address2: `noM${index}_ADD2`,
        address3: `noM${index}_ADD3`,
        city: `noM${index}_CITY`,
        pin: `noM${index}_PIN`,
        country: `noM${index}_CON`,
      };

      updated[map[field]] = value;
      return updated;
    });
  };

  const buildPayload = () => {
    const payload: any = {
      clientCode: ClientCode,
      noM_SOA: data.noM_SOA || "",
    };

    // nominee1/2/3 fields
    [1, 2, 3].forEach((i) => {
      payload[`nominee${i}Name`] = data[`nominee${i}Name`] || "";
      payload[`nominee${i}Relationship`] =
        data[`nominee${i}Relationship`] || "";
      payload[`nominee${i}Applicable`] = data[`nominee${i}Applicable`] || "";
      payload[`nominee${i}DOB`] = data[`nominee${i}DOB`] || "";
      payload[`nominee${i}MinorFlag`] = data[`nominee${i}MinorFlag`] || "";
      payload[`nominee${i}Guardian`] = data[`nominee${i}Guardian`] || "";

      payload[`noM${i}_IDNO`] = data[`noM${i}_IDNO`] || "";
      payload[`noM${i}_EMAIL`] = data[`noM${i}_EMAIL`] || "";
      payload[`noM${i}_MOB`] = data[`noM${i}_MOB`] || "";
      payload[`noM${i}_ADD1`] = data[`noM${i}_ADD1`] || "";
      payload[`noM${i}_ADD2`] = data[`noM${i}_ADD2`] || "";
      payload[`noM${i}_ADD3`] = data[`noM${i}_ADD3`] || "";
      payload[`noM${i}_CITY`] = data[`noM${i}_CITY`] || "";
      payload[`noM${i}_PIN`] = data[`noM${i}_PIN`] || "";
      payload[`noM${i}_CON`] = data[`noM${i}_CON`] || "";
    });

    console.log(payload, "Nominee payload");
  };

  return (
    <Card sx={{ borderRadius: 4, p: 2, mb: 3 }}>
      <Button onClick={onPhysicalOnboard}>back</Button>
      <PrimaryHolder data={data} />
      <h3 style={{ padding: "20px" }}>Nominee Details</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px",
        }}
      >
        {[1, 2, 3].map((i) => (
          <Nominee key={i} index={i} data={data} onChange={updateNominee} />
        ))}
      </div>
      <Button
        onClick={() => {
          buildPayload();
        }}
      >
        Save
      </Button>
    </Card>
  );
};

export default PhysicalOnboard;
