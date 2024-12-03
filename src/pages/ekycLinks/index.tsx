import { useState } from "react";
import { Card } from "reactstrap";
import PennyPalLogo from "../../assets/images/pennyPal.png";
import getSetGrowLogo from "../../assets/images/Get_Set_Grow.png";
import { CopyableLink } from "../../components/common/CopyableLink";
import { BrokerageSection } from "../../components/common/BrokerageSection";

const EKYCLink = () => {
  const [buttonTexts, setButtonTexts] = useState({
    getSetGrow: "Copy",
    pennyPal: "Copy",
    ReEkyc: "Copy",
  });

  const handleCopy = (linkName: string, link: string) => {
    navigator.clipboard.writeText(link);
    setButtonTexts((prev) => ({ ...prev, [linkName]: "Copied" }));

    setTimeout(() => {
      setButtonTexts((prev) => ({ ...prev, [linkName]: "Copy" }));
    }, 2000);
  };

  return (
    <Card style={{ minHeight: "85vh", padding: "16px" }}>
      <CopyableLink
        linkName="getSetGrow"
        logo={getSetGrowLogo}
        link="https://ekyc.lkponline.com/admin/lkpsec"
        buttonText={buttonTexts.getSetGrow}
        onCopy={() =>
          handleCopy("getSetGrow", "https://ekyc.lkponline.com/admin/lkpsec")
        }
      />
      <BrokerageSection />
      <CopyableLink
        linkName="pennyPal"
        logo={PennyPalLogo}
        link="https://ekyc.pennypal.in/admin/lkpsec"
        buttonText={buttonTexts.pennyPal}
        onCopy={() =>
          handleCopy("pennyPal", "https://ekyc.pennypal.in/admin/lkpsec")
        }
      />
      <BrokerageSection customBrokerage={true} />
      <CopyableLink
        customClass={true}
        linkName="ReEkyc"
        logo={PennyPalLogo}
        link="https://ekyc.pennypal.in/admin/lkpsec"
        buttonText={buttonTexts.ReEkyc}
        onCopy={() =>
          handleCopy("ReEkyc", "https://ekyc.pennypal.in/admin/lkpsec")
        }
      />
    </Card>
  );
};

export default EKYCLink;
