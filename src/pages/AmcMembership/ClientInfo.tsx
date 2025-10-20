import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button } from "reactstrap";
import { AppDispatch, RootState } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { capitalizeEachWord } from "../../utils";

interface ClientInfoProps {
  onNext: () => void;
  selectedRow: any;
  setClientData: (data: any) => void; //  add this
}

const ClientInfo = ({
  onNext,
  selectedRow,
  setClientData,
}: ClientInfoProps) => {
  const [clientData, setLocalClientData] = useState<any>(null);
  // const [clientData, setClientData] = useState<any>(null);
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("ClientInfo got selected row:", selectedRow);

    const fetchData = async () => {
      // if (!selectedRow?.dP_ID || !user_id) {
      //   console.warn("Missing dP_ID or user_id");
      //   return;
      // }

      const payload = {
        dP_ID: selectedRow?.dP_ID,
        // dP_ID: "1203000000010904",
        // dP_ID: "1203000001123371", //MTO6
        // dP_ID: "1203000001442910", //98885
        // dP_ID: "1203000001582961", //bha
        userId: user_id,
      };

      dispatch(showLoader("Please wait, we are processing your request..."));

      try {
        const response = await apiServices.GetClientModuleDetails(payload);
        const result = response?.data?.data?.[0] || null;
        console.log(" GetClientModuleDetails:", result);
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

  // Extract and safely display API values with fallback
  const primaryHolder = clientData?.primary_Holder || "-";
  const secondaryHolder = clientData?.secondary_Holder_Name || "-";
  const tertiaryHolder = clientData?.third_Holder_Name || "-";
  const email = clientData?.email_id || "-";
  const mobile = clientData?.mobile_No || "-";
  const dpId = clientData?.dP_ID || "-";

  return (
    <>
      {/* Holder Info */}
      <Row style={{ padding: "0 1rem" }}>
        <Col md="6" className="mb-3">
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

          <hr style={dividerStyle} />

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

        <Col md="6" className="mb-3">
          <p>
            <strong>DP ID:</strong>{" "}
            <span style={{ color: "#333" }}>{dpId}</span>
          </p>

          <hr style={dividerStyle} />

          <p>
            <strong>Lifetime AMC Fee:</strong>{" "}
            <span style={{ color: "#333" }}>
              ₹ 1,770 <small> ( ₹ 1500 + GST)</small>
            </span>
          </p>

          <hr style={dividerStyle} />
        </Col>
      </Row>

      {/* Proceed Button */}
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
        }}
      >
        <Button
          color="primary"
          style={{
            padding: "0.6rem 2rem",
            borderRadius: "6px",
            backgroundColor: "#003366",
            border: "none",
          }}
          onClick={onNext}
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
