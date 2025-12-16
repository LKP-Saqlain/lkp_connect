import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button } from "reactstrap";
import { AppDispatch, RootState } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { capitalizeEachWord } from "../../utils";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
// import { decryptAES } from "../../utils/encryptDecrypt";

interface ClientInfoProps {
  onNext: () => void;
  selectedRow: any;
  setClientData: (data: any) => void; //  add this
  goToStep4: () => void;
  passUserId: any;
}

const ClientInfo = ({
  onNext,
  selectedRow,
  setClientData,
  goToStep4,
  passUserId,
}: ClientInfoProps) => {
  const [clientData, setLocalClientData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<boolean | null>(null);
  // const [clientData, setClientData] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const reduxUserId = useSelector(
    (state: RootState) => state.UserLogin?.data?.data?.user_id
  );
  const user_id = reduxUserId || passUserId || "";
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("ClientInfo got selected row:", selectedRow);

    const fetchData = async () => {
      // if (!selectedRow?.dP_ID || !user_id) {
      //   console.warn("Missing dP_ID or user_id");
      //   return;
      // }

      const payload = {
        dP_ID: selectedRow?.dpid,
        // dP_ID: "1203000000010904",
        // dP_ID: "1203000001123371", //MTO6
        // dP_ID: "1203000001442910", //98885
        // dP_ID: "1203000001582961", //bha
        userId: user_id,
      };

      dispatch(showLoader("Please wait, we are processing your request..."));

      try {
        const response = await apiServices.GetClientModuleDetails(payload);
        console.log("GetClientModuleDetails:", response?.data?.data);
        const result = response?.data?.data?.[0] || null;

        setLocalClientData(result);
        setClientData(result); //  this sends data to parent (AmcMembership)
      } catch (error) {
        console.error(" Error fetching client module details:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchData();
  }, [dispatch, selectedRow, user_id]);

  const checkPaymentStatus = async () => {
    const payload = {
      boid: selectedRow?.dpid,
      userId: user_id,
    };
    // {
    //   boid: "1203000001123371",
    //   userId: "EMP-5376",
    // };
    dispatch(showLoader("Checking payment status..."));
    try {
      const response = await apiServices.GetAMCActivationStatus(payload);
      console.log(
        "GetAMCActivationStatus Payment link response:",
        response?.data?.data[0]
      );
      if (response?.data?.data[0]?.message === "Record Found") {
        setPaymentStatus(true);
      } else {
        setPaymentStatus(false);
      }
    } catch (error) {
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, []);
  const handleClick = () => {
    if (paymentStatus === true) {
      goToStep4();
    } else {
      onNext();
    }
  };
  // Extract and safely display API values with fallback
  const primaryHolder = clientData?.ph1 || "-- Not Applicable --";
  const secondaryHolder = clientData?.ph2 || "-- Not Applicable --";
  const tertiaryHolder = clientData?.ph3 || "-- Not Applicable --";
  const email = clientData?.em || "-";
  const mobile = clientData?.mob || "-";
  const dpId = clientData?.dpid || "-";

  return (
    <>
      {/* Holder Info */}
      <Row
        style={{
          padding: isMobile ? "0 0.5rem" : "0 1rem",
          minHeight: isMobile ? "auto" : "60vh",
          minWidth: isMobile ? "100%" : "70vw",
          fontSize: isMobile ? "16px" : "21px",
          lineHeight: isMobile ? "1.8" : "2.6",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <Col
          md="6"
          className="mb-3"
          style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
        >
          <p>
            <strong>Primary Holder:</strong>{" "}
            <span style={{ color: "#333" }}>{primaryHolder}</span>
          </p>

          <p>
            <strong>Second Holder:</strong>{" "}
            <span style={{ color: "#333" }}>{secondaryHolder}</span>
          </p>

          <p>
            <strong>Third Holder:</strong>{" "}
            <span style={{ color: "#333" }}>{tertiaryHolder}</span>
          </p>

          {!isMobile && <hr style={dividerStyle} />}

          <p>
            <strong>Email ID:</strong>{" "}
            <span style={{ color: "#333" }}>{capitalizeEachWord(email)}</span>
          </p>

          <hr style={dividerStyle} />

          <p>
            <strong>Mobile Number:</strong>{" "}
            <span style={{ color: "#333" }}>{mobile}</span>
          </p>

          <hr style={dividerStyle} />
        </Col>

        <Col
          md="6"
          className="mb-3"
          style={{ marginBottom: isMobile ? "1rem" : "2rem" }}
        >
          <p>
            <strong>DP ID:</strong>{" "}
            <span style={{ color: "#333" }}>{dpId}</span>
          </p>

          <hr style={dividerStyle} />

          <p>
            <strong>Lifetime AMC Fee:</strong>{" "}
            <span style={{ color: "#333" }}>
              ₹ 1,770.00 <small>(₹ 1500.00 + GST)</small>
            </span>
          </p>

          <hr style={dividerStyle} />
        </Col>
      </Row>

      {/* Proceed Button */}
      <div
        style={{
          textAlign: "center",
          marginTop: isMobile ? "1.5rem" : "2rem",
        }}
      >
        <Button
          color="primary"
          style={{
            padding: isMobile ? "0.5rem 1.5rem" : "0.3rem 2rem",
            borderRadius: "6px",
            backgroundColor: "#003366",
            border: "none",
            fontSize: isMobile ? "18px" : "21px",
            width: isMobile ? "100%" : "auto",
          }}
          onClick={handleClick}
        >
          Proceed
        </Button>
      </div>
    </>
  );
};

// Common divider style
const dividerStyle = {
  border: "none",
  borderTop: "1px dotted #999",
  margin: "1rem 0",
};

export default ClientInfo;
