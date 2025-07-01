import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import ModalComponent from "../../../components/common/masterModal";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";

const InsertUnlistedShares = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [editUserCheck, setEditUserCheck] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    console.log("Test", activeSubItem);
  }, [activeSubItem]);

  function tog_grid() {
    setmodal_grid(!modal_grid);
    setEditUserCheck(false);
  }
  const unformatNumber = (value: any): number =>
    parseFloat(value?.toString().replace(/,/g, "") || "0");

  const handleFormSubmit = async (
    data: any,
    apiStatus: any,
    fileBase64: any
  ) => {
    console.log("FormData", data, apiStatus, fileBase64);
    const {
      brokExcGST,
      brokIncGST,
      brokPerShare,
      clientName,
      gst,
      netBrokerage,
      noOfShare,
      rmCode,
      sbCode,
      sbCommision,
      sbRate,
      securitiesName,
      transactionDate,
    } = data;

    let payload = {
      user_Id: user_id,
      transactionDate,
      clientName,
      securitiesName,
      noOfShares: unformatNumber(noOfShare),
      brokeragePerShare: unformatNumber(brokPerShare),
      brokerageInclusiveGST: unformatNumber(brokIncGST),
      gst: unformatNumber(gst),
      brokerageExclusiveGST: unformatNumber(brokExcGST),
      sbCode: sbCode?.toString().trim(),
      sbRate: unformatNumber(sbRate),
      sbCommission: unformatNumber(sbCommision),
      netBrokerage: unformatNumber(netBrokerage),
      rmCode: rmCode?.toString().trim(),
    };
    console.log("Payload", payload);

    dispatch(showLoader(""));
    apiServices
      .InsertUnlistedSharesRecord(payload)
      .then((respones) => {
        if (respones?.status === 200) {
          console.log("InsertResponse", respones?.status);
          dispatch(hideLoader());
          setmodal_grid(false);
        }
      })
      .catch((Error) => {
        console.log("Errror", Error);
        dispatch(hideLoader());
      });
  };
  return (
    <div className="page-content page-view">
      <div className="container-fluid">
        <Row className="row-font">
          <Col lg={12}>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              <CardHeader
                style={{
                  borderRadius: "15px 15px 0 0",
                  boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                  backgroundColor: "#fff",
                  padding: "0.2rem 0.8rem",
                }}
              >
                <h4 className="card-title mb-0">Unlisted Record Insert</h4>
              </CardHeader>
              <CardBody>
                {" "}
                <Box>
                  <ModalComponent
                    modal_grid={modal_grid}
                    tog_grid={tog_grid}
                    // editData={editData}
                    onSubmit={handleFormSubmit}
                    editUserCheck={editUserCheck}
                    isUnlistedContent={true}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    className="btn-font"
                    onClick={tog_grid}
                    style={{
                      backgroundColor: "#11395C",
                      marginBottom: "1rem",
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default InsertUnlistedShares;
