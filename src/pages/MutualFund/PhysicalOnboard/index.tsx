import { useDispatch } from "react-redux";
import { Card } from "reactstrap";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useEffect, useState } from "react";
import { Button } from "rsuite";
import PrimaryHolder from "./PrimaryHolder";
import Nominee from "./Nominee";
import { apiServices } from "../../../services";
import { encryptAES } from "../../../utils/encryptDecrypt";
type NomStatus = { [k: number]: boolean };

const PhysicalOnboard = ({ ClientCode, onPhysicalOnboard }: any) => {
  const [data, setData] = useState<any>({});
  const [nomineeStatus, setNomineeStatus] = useState<NomStatus>({
    1: false,
    2: true,
    3: true,
  });

  const dispatch = useDispatch<AppDispatch>();

  const ClientInfo = () => {
    dispatch(showLoader("Fetching Client Code..."));

    apiServices
      .PhysicalClientInfo({ ClientCode }) // ⬅ SAME STRUCTURE AS NomineeInsertPhysical
      .then((response: any) => {
        console.log("PhysicalClientInfo Response:", response);
        const data = response?.data?.data || {};
        setData(data);
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    if (ClientCode) ClientInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ClientCode]);

  // updateNominee expects parent key names (e.g. nominee1Name, noM1_ID_TYP, ...)
  const updateNominee = ({
    // _index,
    field,
    value,
  }: any) => {
    setData((prev: any) => {
      const updated = { ...prev };
      updated[field] = value;
      return updated;
    });
  };

  const buildPayload = () => {
    const payload: any = {
      clientCode: data.clientCode || ClientCode,

      // Primary Holder
      primaryHolderFirstName: data.primaryHolderFirstName || "",
      primaryHolderMiddleName: data.primaryHolderMiddleName || "",
      primaryHolderLastName: data.primaryHolderLastName || "",
      gender: data.gender || "",
      primaryHolderDOB: data.primaryHolderDOB || "",
      occupationCode: data.occupationCode || "",
      primaryHolderPAN: data.primaryHolderPAN || "",
      primaryHolderPANExempt: data.primaryHolderPANExempt || "",
      primaryHolderExemptCategory: data.primaryHolderExemptCategory || "",
      primaryHolderKYCType: data.primaryHolderKYCType || "",
      primaryHolderCKYCNumber: data.primaryHolderCKYCNumber || "",
      primaryHolderKRAExemptRefNo: data.primaryHolderKRAExemptRefNo || "",

      taxStatus: data.taxStatus || "",
      holdingNature: data.holdingNature || "",

      // Second Holder
      secondHolderFirstName: data.secondHolderFirstName || "",
      secondHolderMiddleName: data.secondHolderMiddleName || "",
      secondHolderLastName: data.secondHolderLastName || "",
      secondHolderDOB: data.secondHolderDOB || "",
      secondHolderPAN: data.secondHolderPAN || "",
      secondHolderPANExempt: data.secondHolderPANExempt || "",
      secondHolderExemptCategory: data.secondHolderExemptCategory || "",
      secondHolderKYCType: data.secondHolderKYCType || "",
      secondHolderCKYCNumber: data.secondHolderCKYCNumber || "",
      secondHolderKRAExemptRefNo: data.secondHolderKRAExemptRefNo || "",
      secondHolderEmail: data.secondHolderEmail || "",
      secondHolderEmailDeclaration: data.secondHolderEmailDeclaration || "",
      secondHolderMobileNo: data.secondHolderMobileNo || "",
      secondHolderMobileDeclaration: data.secondHolderMobileDeclaration || "",

      // Third Holder
      thirdHolderFirstName: data.thirdHolderFirstName || "",
      thirdHolderMiddleName: data.thirdHolderMiddleName || "",
      thirdHolderLastName: data.thirdHolderLastName || "",
      thirdHolderDOB: data.thirdHolderDOB || "",
      thirdHolderPAN: data.thirdHolderPAN || "",
      thirdHolderPANExempt: data.thirdHolderPANExempt || "",
      thirdHolderExemptCategory: data.thirdHolderExemptCategory || "",
      thirdHolderKYCType: data.thirdHolderKYCType || "",
      thirdHolderCKYCNumber: data.thirdHolderCKYCNumber || "",
      thirdHolderKRAExemptRefNo: data.thirdHolderKRAExemptRefNo || "",
      thirdHolderEmail: data.thirdHolderEmail || "",
      thirdHolderEmailDeclaration: data.thirdHolderEmailDeclaration || "",
      thirdHolderMobileNo: data.thirdHolderMobileNo || "",
      thirdHolderMobileDeclaration: data.thirdHolderMobileDeclaration || "",

      // Guardian
      guardianFirstName: data.guardianFirstName || "",
      guardianMiddleName: data.guardianMiddleName || "",
      guardianLastName: data.guardianLastName || "",
      guardianDOB: data.guardianDOB || "",
      guardianPAN: data.guardianPAN || "",
      guardianPANExempt: data.guardianPANExempt || "",
      guardianExemptCategory: data.guardianExemptCategory || "",
      guardianKYCType: data.guardianKYCType || "",
      guardianCKYCNumber: data.guardianCKYCNumber || "",
      guardianExemptRefNo: data.guardianExemptRefNo || "",
      guardianRelationship: data.guardianRelationship || "",

      clientType: data.clientType || "",
      pms: data.pms || "",

      // DP
      defaultDP: data.defaultDP || "",
      cdsldpid: data.cdsldpid || "",
      cdslcltid: data.cdslcltid || "",
      cmbpId: data.cmbpId || "",
      nsdldpid: data.nsdldpid || "",
      nsdlcltid: data.nsdlcltid || "",

      // Bank Accounts
      accountType1: data.accountType1 || "",
      accountNo1: data.accountNo1 || "",
      micrNo1: data.micrNo1 || "",
      ifscCode1: data.ifscCode1 || "",
      defaultBankFlag1: data.defaultBankFlag1 || "",

      accountType2: data.accountType2 || "",
      accountNo2: data.accountNo2 || "",
      micrNo2: data.micrNo2 || "",
      ifscCode2: data.ifscCode2 || "",
      defaultBankFlag2: data.defaultBankFlag2 || "",

      accountType3: data.accountType3 || "",
      accountNo3: data.accountNo3 || "",
      micrNo3: data.micrNo3 || "",
      ifscCode3: data.ifscCode3 || "",
      defaultBankFlag3: data.defaultBankFlag3 || "",

      accountType4: data.accountType4 || "",
      accountNo4: data.accountNo4 || "",
      micrNo4: data.micrNo4 || "",
      ifscCode4: data.ifscCode4 || "",
      defaultBankFlag4: data.defaultBankFlag4 || "",

      accountType5: data.accountType5 || "",
      accountNo5: data.accountNo5 || "",
      micrNo5: data.micrNo5 || "",
      ifscCode5: data.ifscCode5 || "",
      defaultBankFlag5: data.defaultBankFlag5 || "",

      chequeName: data.chequeName || "",
      divPayMode: data.divPayMode || "",

      // Address
      address1: data.address1 || "",
      address2: data.address2 || "",
      address3: data.address3 || "",
      city: data.city || "",
      state: data.state || "",
      pincode: data.pincode || "",
      country: data.country || "",
      resiPhone: data.resiPhone || "",
      resiFax: data.resiFax || "",
      officePhone: data.officePhone || "",
      officeFax: data.officeFax || "",
      email: data.email || "",
      communicationMode: data.communicationMode || "",
      indianMobileNo: data.indianMobileNo || "",

      // Foreign Address
      foreignAddress1: data.foreignAddress1 || "",
      foreignAddress2: data.foreignAddress2 || "",
      foreignAddress3: data.foreignAddress3 || "",
      foreignAddressCity: data.foreignAddressCity || "",
      foreignAddressPincode: data.foreignAddressPincode || "",
      foreignAddressState: data.foreignAddressState || "",
      foreignAddressCountry: data.foreignAddressCountry || "",
      foreignAddressResiPhone: data.foreignAddressResiPhone || "",
      foreignAddressFax: data.foreignAddressFax || "",
      foreignAddressOfficePhone: data.foreignAddressOfficePhone || "",
      foreignAddressOfficeFax: data.foreignAddressOfficeFax || "",

      // Nominee 1/2/3
      nominee1Name: data.nominee1Name || "",
      nominee1Relationship: data.nominee1Relationship || "",
      nominee1Applicable: data.nominee1Applicable || "",
      nominee1DOB: data.nominee1DOB || "",
      nominee1MinorFlag: data.nominee1MinorFlag || "",
      nominee1Guardian: data.nominee1Guardian || "",

      nominee2Name: data.nominee2Name || "",
      nominee2Relationship: data.nominee2Relationship || "",
      nominee2Applicable: data.nominee2Applicable || "",
      nominee2DOB: data.nominee2DOB || "",
      nominee2MinorFlag: data.nominee2MinorFlag || "",
      nominee2Guardian: data.nominee2Guardian || "",

      nominee3Name: data.nominee3Name || "",
      nominee3Relationship: data.nominee3Relationship || "",
      nominee3Applicable: data.nominee3Applicable || "",
      nominee3DOB: data.nominee3DOB || "",
      nominee3MinorFlag: data.nominee3MinorFlag || "",
      nominee3Guardian: data.nominee3Guardian || "",

      // Nominee PAN / Guardian PAN
      nomineePAN1: data.nomineePAN1 || "",
      nomineeGuardianPAN1: data.nomineeGuardianPAN1 || "",
      nomineePAN2: data.nomineePAN2 || "",
      nomineeGuardianPAN2: data.nomineeGuardianPAN2 || "",
      nomineePAN3: data.nomineePAN3 || "",
      nomineeGuardianPAN3: data.nomineeGuardianPAN3 || "",

      // Nominee ID / Address Blocks
      noM1_ID_TYP: data.noM1_ID_TYP || "",
      noM1_IDNO: data.noM1_IDNO || "",
      noM1_EMAIL: data.noM1_EMAIL || "",
      noM1_MOB: data.noM1_MOB || "",
      noM1_ADD1: data.noM1_ADD1 || "",
      noM1_ADD2: data.noM1_ADD2 || "",
      noM1_ADD3: data.noM1_ADD3 || "",
      noM1_CITY: data.noM1_CITY || "",
      noM1_PIN: data.noM1_PIN || "",
      noM1_CON: data.noM1_CON || "",

      noM2_ID_TYP: data.noM2_ID_TYP || "",
      noM2_IDNO: data.noM2_IDNO || "",
      noM2_EMAIL: data.noM2_EMAIL || "",
      noM2_MOB: data.noM2_MOB || "",
      noM2_ADD1: data.noM2_ADD1 || "",
      noM2_ADD2: data.noM2_ADD2 || "",
      noM2_ADD3: data.noM2_ADD3 || "",
      noM2_CITY: data.noM2_CITY || "",
      noM2_PIN: data.noM2_PIN || "",
      noM2_CON: data.noM2_CON || "",

      noM3_ID_TYP: data.noM3_ID_TYP || "",
      noM3_IDNO: data.noM3_IDNO || "",
      noM3_EMAIL: data.noM3_EMAIL || "",
      noM3_MOB: data.noM3_MOB || "",
      noM3_ADD1: data.noM3_ADD1 || "",
      noM3_ADD2: data.noM3_ADD2 || "",
      noM3_ADD3: data.noM3_ADD3 || "",
      noM3_CITY: data.noM3_CITY || "",
      noM3_PIN: data.noM3_PIN || "",
      noM3_CON: data.noM3_CON || "",

      // Misc
      noM_SOA: data.noM_SOA || "",
      aadhaarUpdated: data.aadhaarUpdated || "",
      mapinId: data.mapinId || "",
      paperlessFlag: data.paperlessFlag || "",
      leiNumber: data.leiNumber || "",
      leiValidity: data.leiValidity || "",
      filler1MobileDeclarationFlag: data.filler1MobileDeclarationFlag || "",
      filler2EmailDeclarationFlag: data.filler2EmailDeclarationFlag || "",
      mobileDeclarationFlag: data.mobileDeclarationFlag || "",
      emailDeclarationFlag: data.emailDeclarationFlag || "",
      nominationOpt: data.nominationOpt || "",
      nominationAuthMode: data.nominationAuthMode || "",

      // filler fields
      filler1: data.filler1 || "",
      filler2: data.filler2 || "",
      filler3: data.filler3 || "",
      filler4: data.filler4 || "",
      filler5: data.filler5 || "",
      filler6: data.filler6 || "",
      filler7: data.filler7 || "",
      filler8: data.filler8 || "",
    };

    console.log("FINAL PAYLOAD =", payload);
    return payload;
  };

  const onNomineeSaveStatus = (index: number, isValid: boolean) => {
    setNomineeStatus((prev) => ({ ...prev, [index]: isValid }));
  };

  const sendNomineeData = () => {
    const nomineePayload = buildPayload();
    const payload = { clientCode: ClientCode, ...nomineePayload };
    console.log("Sending Payload:", payload);

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .NomineeInsertPhysical(payload)
      .then((response) => {
        console.log("Nominee Submit Response:", response);
        FinalApiCalls();
      })
      .catch((error) => {
        console.error("Error saving nominee:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const FinalApiCalls = async () => {
    try {
      dispatch(showLoader("Processing..."));

      // 1️⃣ Registration
      const regResponse = await apiServices.PhysicalClientRegistration({
        ClientCode,
      });
      console.log("Registration Response:", regResponse);

      const regData = regResponse?.data || {};
      const message = String(regData?.message || "").toLowerCase();

      const isRegistered =
        message.includes("registered successfully") ||
        message.includes("save successfully");

      console.log("Registered?", isRegistered);

      if (!isRegistered) {
        console.warn("Registration NOT successful → skipping Elog");
        return; // stop further execution
      }

      // 2️⃣ Call Elog API
      let loopBackUrl = encryptAES(ClientCode);
      loopBackUrl = encodeURIComponent(loopBackUrl);
      loopBackUrl = `${window.location.origin}/PhysicalStats/${loopBackUrl}`;

      const elogResponse = await apiServices.ElogForPhysical({
        ClientCode,
        loopBackUrl,
      });

      console.log("ElogForPhysical Response:", elogResponse);

      if (elogResponse?.data?.message === "ELOG Link Generated Successfully") {
        const url = elogResponse?.data?.data;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("FinalApiCalls Error:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleSubmit = () => {
    const parseIntSafe = (v: any) => {
      if (!v && v !== 0) return 0;
      const n = Number(String(v).replace(/\D/g, ""));
      return isNaN(n) ? 0 : n;
    };

    const sum =
      parseIntSafe(data.nominee1Applicable) +
      parseIntSafe(data.nominee2Applicable) +
      parseIntSafe(data.nominee3Applicable);

    if (sum !== 100) {
      alert("Total applicable percentage of nominees must be 100%");
      return;
    }
    // If sum is 100, proceed
    sendNomineeData();
    // buildPayload();
  };

  const isSubmitEnabled =
    nomineeStatus[1] && nomineeStatus[2] && nomineeStatus[3];

  return (
    <Card style={{ padding: "20px", height: "77vh" }}>
      <div
        style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "8px" }}
      >
        {/* STICKY HEADER */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "#FFF",
            zIndex: 10,
            padding: "10px 0",
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h4
            style={{
              margin: 0,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            Physical Onboarding
          </h4>

          <Button
            style={{
              marginLeft: "auto",
              backgroundColor: "#11395C",
              color: "#FFF",
            }}
            onClick={onPhysicalOnboard}
          >
            Back
          </Button>
        </div>

        {/* CONTENT */}
        <h4 style={{ marginBottom: "15px" }}>Primary Holder Details</h4>
        <PrimaryHolder data={data} />

        <h4 style={{ margin: "15px 0" }}>Nominee Details</h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "18px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <Nominee
              key={i}
              index={i}
              data={data}
              onChange={updateNominee}
              onSaveStatus={onNomineeSaveStatus}
            />
          ))}
        </div>

        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#FFF",
            padding: "10px 0",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 5,
          }}
        >
          <Button
            disabled={!isSubmitEnabled}
            style={{
              backgroundColor: isSubmitEnabled ? "#11395C" : "#999",
              color: "#FFF",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PhysicalOnboard;
