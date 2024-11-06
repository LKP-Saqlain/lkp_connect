import * as React from "react";
// import Chip from "@mui/material/Chip";
// import Stack from "@mui/material/Stack";
import { Card, CardBody, Col, Row } from "reactstrap";
import { ClientDetailsCapsule } from "../../../components/common/Capsules";
// import { useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";

interface userCapsules {
  selectedCapsule: any;
  handleClick(arg: any): any;
}

const UserCapsules = ({ selectedCapsule, handleClick }: userCapsules) => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <React.Fragment>
      <Row>
        {(ClientDetailsCapsule || []).map((item, key) => (
          <Col md={3} key={key}>
            <Card
              className={`rounded-pill capsule-hover ${
                selectedCapsule ? "selected-widget" : ""
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
              }}
            >
              <CardBody>
                <div
                  className="d-flex align-items-center justify-content-row"
                  style={{ height: "20px" }}
                >
                  <div className="flex-grow-1 text cursor-pointer">
                    <p
                      className="fw-semibold fs-12 mb-1 trade-dash-txt text-center"
                      style={{
                        fontFamily: "Public Sans",
                      }}
                      onClick={() => handleClick(item.label)}
                    >
                      {item.label}
                    </p>
                    {/* {item.count !== undefined && ( */}
                    <h1
                      className="text-center fs-10"
                      style={{
                        color: selectedCapsule === item.label ? "#fff" : "#000",
                        display: item.count === undefined ? "none" : "",
                      }}
                    >
                      {`Count - ${item.count}`}
                    </h1>
                    {/* )} */}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};
export default UserCapsules;
