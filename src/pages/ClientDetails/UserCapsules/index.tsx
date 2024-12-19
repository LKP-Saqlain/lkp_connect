import * as React from "react";
// import Chip from "@mui/material/Chip";
// import Stack from "@mui/material/Stack";
import { Card, CardBody, Col, Row } from "reactstrap";
import { ClientDetailsCapsule } from "../../../components/common/Capsules";
// import { useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
import "../style.css";

interface userCapsules {
  selectedCapsule: any;
  handleClick(arg: any): any;
  totalCount: any;
  activeClient: any;
  inactiveClient: any;
}

const UserCapsules = ({
  selectedCapsule,
  handleClick,
  totalCount,
  activeClient,
  inactiveClient,
}: userCapsules) => {
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
                marginTop: "0px",
                marginBottom: "8px",
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
                        marginBottom: 0,
                      }}
                      onClick={() => handleClick(item.label)}
                    >
                      {item.label}
                      {item.label === "Total Clients" && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontWeight: "600",
                            color:
                              selectedCapsule === item.label ? "#fff" : "#000",
                          }}
                        >
                          {new Intl.NumberFormat("en-IN").format(
                            Math.round(totalCount)
                          )}
                        </span>
                      )}
                      {item.label === "Active Clients" && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontWeight: "600",
                            color:
                              selectedCapsule === item.label ? "#fff" : "#000",
                          }}
                        >
                          {new Intl.NumberFormat("en-IN").format(
                            Math.round(activeClient)
                          )}
                        </span>
                      )}
                      {item.label === "Inactive Clients" && (
                        <span
                          style={{
                            marginLeft: "10px",
                            fontWeight: "600",
                            color:
                              selectedCapsule === item.label ? "#fff" : "#000",
                          }}
                        >
                          {new Intl.NumberFormat("en-IN").format(
                            Math.round(inactiveClient)
                          )}
                        </span>
                      )}
                    </p>

                    {/* {item.count !== undefined && ( */}
                    {/* <h1
                      className="text-center fs-10"
                      style={{
                        color: selectedCapsule === item.label ? "#fff" : "#000",
                        display: item.count === undefined ? "none" : "",
                      }}
                    >
                      {item.label === "Total Clients"
                        ? `Count - ${totalCount}`
                        : item.label === "Active Clients"
                        ? `Count - ${activeClient}`
                        : item.label === "Inactive Clients"
                        ? `Count - ${inactiveClient}`
                        : ""}
                    </h1> */}
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
