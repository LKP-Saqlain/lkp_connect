import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import UserInfoTable from "../../../components/common/UserInfoTable";
import { Button } from "@mui/material";
import { useState } from "react";

const selectedStyle = {
  bgcolor: "#11395C",
  color: "#fff",
  borderRadius: "7px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  textTransform: "capitalize",
};

const nonSelectedStyle = {
  bgcolor: "#ABC4DA",
  color: "#11395C",
  borderRadius: "7px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  textTransform: "capitalize",
};

const Retrival = ({ activeSubItem }: any) => {
  const [selectedButton, setSelectedButton] = useState<string>("Daily");

  return (
    <Card>
      {/* <CardHeader style={{ fontFamily: "Poppins" }}>
        Communication Retrival
      </CardHeader> */}
      <CardHeader className="p-0 border-0 bg-light-subtle">
        <Row className="g-0 text-center">
          <Col xs={12}>
            <div className="p-3 border border-dashed border-start-0 d-flex flex-column flex-md-row align-items-center">
              <span className="card-title mb-2 mb-md-0 flex-grow-1 text-md-start text-center chart-header">
                Communication Retrival
              </span>
              <div className="d-flex gap-1">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedButton("Daily")}
                  sx={
                    selectedButton === "Daily"
                      ? selectedStyle
                      : nonSelectedStyle
                  }
                >
                  F.Y.
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedButton("Weekly")}
                  sx={
                    selectedButton === "Weekly"
                      ? selectedStyle
                      : nonSelectedStyle
                  }
                >
                  Type of document
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedButton("Monthly")}
                  sx={
                    selectedButton === "Monthly"
                      ? selectedStyle
                      : nonSelectedStyle
                  }
                >
                  Department
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        {/* <DataTable
          customFlag={true}
          dynamicHeader={dormantColumns}
          tableData={userData}
        /> */}
        <UserInfoTable
          //   showSearch={true}
          activeSubItem={activeSubItem}
          //   handleSearchBasedOnInput={handleSearchBasedOnInput}
          //   searchValue={searchQuery}
          T6Data={[]}
          //   getUserDetails={getUserDetails}
          //   emailSentStatus={emailSentStatus}
        />
      </CardBody>
    </Card>
  );
};

export default Retrival;
