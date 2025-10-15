import * as React from "react";
// import Chip from "@mui/material/Chip";
// import Stack from "@mui/material/Stack";
import { Card, CardBody, Col, Row } from "reactstrap";
import {
  ClientDetailsCapsule,
  ODCapsules,
  DPDebitCapsules,
  pledgeCapsules,
  partnerContestCapsules,
  AmcMembership,
} from "../../../helper/tableColumns.tsx";
// import { useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
import "../style.css";

interface userCapsules {
  selectedCapsule?: any;
  handleClick?(arg: any): any;
  totalCount?: any;
  activeClient?: any;
  inactiveClient?: any;
  capsuleType?: string;
  targetData?: any;
}

const UserCapsules = ({
  selectedCapsule,
  handleClick,
  // totalCount,
  // activeClient,
  // inactiveClient,
  capsuleType,
  targetData,
}: userCapsules) => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const capsules =
    capsuleType === "ClientDetails"
      ? ClientDetailsCapsule
      : capsuleType === "DPDebit"
      ? DPDebitCapsules
      : capsuleType === "Pledge Request"
      ? pledgeCapsules
      : capsuleType === "Partner Contest"
      ? partnerContestCapsules
      : capsuleType === "AMC Membership"
      ? AmcMembership
      : ODCapsules;

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap", // responsive
          gap: "10px",
        }}
      >
        {/* Left: Capsules */}
        <div style={{ flex: 1 }}>
          <Row>
            {capsules.map((item, key) => (
              <Col md={capsuleType === "DPDebit" ? 4 : 3} key={key}>
                <Card
                  className={`rounded-pill capsule-hover ${
                    selectedCapsule === item.label ? "selected-widget" : ""
                  }`}
                  style={{
                    boxShadow:
                      selectedCapsule === item.label
                        ? "0 4px 12px rgba(0, 0, 0, 0.6)"
                        : "0 4px 8px rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    backgroundColor:
                      selectedCapsule === item.label ? "#11395C" : "#fff",
                    color: selectedCapsule === item.label ? "#fff" : "#000",
                    marginTop: "0px",
                    marginBottom: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick?.(item.label)}
                >
                  <CardBody className="text-center">
                    <p
                      className="fw-semibold fs-12 mb-0 trade-dash-txt"
                      style={{
                        fontFamily: "Public Sans",
                      }}
                    >
                      {item.label}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {targetData && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              textAlign: "right",
              lineHeight: "1.6",
              minWidth: "180px",
              fontWeight: 500,
            }}
          >
            <div>AP NAME: {targetData.apName || "-"}</div>
            <div>AP CODE: {targetData.apCode || "-"}</div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default UserCapsules;
