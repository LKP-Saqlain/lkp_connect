import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import ModalComponent from "../../../components/common/masterModal";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import DataTable from "../../../components/common/UserInfoTable";
import dayjs from "dayjs";
import ShowToast from "../../../utils/toastUtils";

export interface UnlistedRecord {
  rowID: number;
  transactionDate: string;
  clientName: string;
  branchCode: string;
  zone: string;
  clientCategory: string;
  rmCode: string;
  rmName: string;
  nameOfSecurities: string;
  noOfShares: number;
  brokeragePerShare: number;
  brokerageInclusiveGST: number;
  gst: number;
  brokerageExclusiveGST: number;
  sbCode: string;
  sbRate: number;
  sbCommission: number;
  netBrokerage: number;
  status: string;
  remarks: string;
  id: number;
}

const InsertUnlistedShares = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState<boolean>(false);
  const [editUserCheck, setEditUserCheck] = useState(false);
  const [unlistedData, setUnlistedData] = useState<any[]>([]);
  const [editData, setEditData] = useState<UnlistedRecord | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    if (editData) {
      console.log("Length:", Object.keys(editData).length);
    } else {
      console.log("editData is null or undefined");
    }
  }, [editData]);

  useEffect(() => {
    let payload = {
      user_Id: user_id,
    };
    dispatch(showLoader(""));
    apiServices
      .ViewUnlistedSharesRecord(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("Response", response?.data?.data);
          dispatch(hideLoader());

          // if (response?.data?.data === null) {
          //   ShowToast("error", response?.data?.message);
          // }
          const filteredResponse = response?.data?.data?.map(
            (item: any, index: number) => ({
              ...item,
              id: index + 1,
              transactionDate: item.transactionDate?.split(" ")[0],
              dealSheetB64: item.dealSheetB64 ? item.dealSheetB64 : null,
            })
          );
          console.log("ViewListedShareRecord", filteredResponse);

          setUnlistedData(filteredResponse);
        }
      })
      .catch((error) => {
        console.log("ERRRRORR", error);
      });
  }, [dispatch]);

  function tog_grid() {
    setmodal_grid(!modal_grid);
    setEditUserCheck(false);
    setEditData(null);
  }
  const unformatNumber = (value: any): number =>
    parseFloat(value?.toString().replace(/,/g, "") || "0");

  const cleanNumber = (value: any): number =>
    typeof value === "string" && value.includes(",")
      ? parseFloat(value.replace(/,/g, ""))
      : Number(value || 0);

  const updateUnlistedVals = (data: any, fileBase64: any) => {
    console.log("updateUnlistedVals", data);

    const formattedDate = dayjs(editData?.transactionDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    console.log(formattedDate, "formattedDate");
    setmodal_grid(false);
    let payload = {
      user_Id: user_id,
      transactionDate: formattedDate,
      clientName: data.clientName,
      securitiesName: data.securitiesName,
      noOfShares: cleanNumber(data?.noOfShare),
      clientRate: data.clientRate,
      vendorRate: data.vendorRate,
      lkpCommissionPerShare: cleanNumber(data?.brokPerShare),
      brokerageInclusiveGST: cleanNumber(data?.brokIncGST),
      gst: cleanNumber(data?.gst),
      brokerageExclusiveGST: cleanNumber(data?.brokExcGST),
      sbCode: data.sbCode ? data.sbCode : "",
      sbRate: cleanNumber(data?.sbRate) ? cleanNumber(data?.sbRate) : 0,
      sbCommission:
        cleanNumber(data?.sbCommision) ??
        cleanNumber(editData?.sbCommission) ??
        0,
      netBrokerage: cleanNumber(data?.netBrokerage),
      rowId: editData?.rowID,
      dealSheetB64: fileBase64,
    };
    console.log("Payload", payload);

    dispatch(showLoader(""));
    apiServices
      .UpdateUnlistedSharesRecord(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("UpdateResponse", response?.data);
          dispatch(hideLoader());
          if (response?.data?.statusCode === 400) {
            ShowToast("error", response?.data?.message);
            return;
          }
          setmodal_grid(false);

          // if (response?.data?.data === null) {
          //   ShowToast("error", response?.data?.message);
          // } else {
          //   ShowToast("success", response?.data?.message);
          // }
          dispatch(showLoader(""));
          apiServices
            .ViewUnlistedSharesRecord(payload)
            .then((response) => {
              if (response?.status === 200) {
                console.log("Response", response?.data?.data);
                dispatch(hideLoader());

                const filteredResponse = response?.data?.data?.map(
                  (item: any, index: number) => ({
                    ...item,
                    id: index + 1,
                    transactionDate: item.transactionDate?.split(" ")[0],
                  })
                );
                setUnlistedData(filteredResponse);
                setEditData(null);
              }
            })
            .catch((error) => {
              console.log("ERRRRORR", error);
            });
        }
      })
      .catch((error) => {
        console.log("Error", error);
        dispatch(hideLoader());
      });
  };

  const handleFormSubmit = async (data: any, fileBase64: any) => {
    console.log("FormData", data, fileBase64);
    if (editData && Object.keys(editData).length > 0) {
      updateUnlistedVals(data, fileBase64);
      return;
    }

    const {
      brokExcGST,
      brokIncGST,
      brokPerShare, //is now LKP Per share
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
      clientRate,
      vendorRate,
    } = data;

    const formattedDate = dayjs(transactionDate, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );
    console.log(formattedDate, "formattedDate");

    let payload = {
      user_Id: user_id,
      transactionDate: formattedDate,
      clientName,
      securitiesName,
      noOfShares: unformatNumber(noOfShare),
      clientRate: unformatNumber(clientRate),
      vendorRate: unformatNumber(vendorRate),
      lkpCommissionPerShare: unformatNumber(brokPerShare),
      brokerageInclusiveGST: unformatNumber(brokIncGST),
      gst: unformatNumber(gst),
      brokerageExclusiveGST: unformatNumber(brokExcGST),
      sbCode: sbCode?.toString().trim() ? sbCode?.toString().trim() : "",
      sbRate: unformatNumber(sbRate) ? unformatNumber(sbRate) : 0,
      sbCommission: unformatNumber(sbCommision)
        ? unformatNumber(sbCommision)
        : 0,
      netBrokerage: unformatNumber(netBrokerage),
      rmCode: rmCode?.toString().trim(),
      dealSheetB64: fileBase64,
    };
    console.log("Payload", payload);

    dispatch(showLoader(""));
    apiServices
      .InsertUnlistedSharesRecord(payload)
      .then((respones) => {
        if (respones?.status === 200) {
          console.log("InsertResponse", respones?.status);

          if (respones?.data?.data === null) {
            ShowToast("error", respones?.data?.message);
          } else {
            ShowToast("success", respones?.data?.message);
          }
          dispatch(hideLoader());
          setmodal_grid(false);

          let payload = {
            user_Id: user_id,
          };

          dispatch(showLoader(""));
          apiServices
            .ViewUnlistedSharesRecord(payload)
            .then((response) => {
              if (response?.status === 200) {
                console.log("Response", response?.data?.data);
                dispatch(hideLoader());
                // if (respones?.data?.data === null) {
                //   ShowToast("error", respones?.data?.message);
                // }
                const filteredResponse = response?.data?.data?.map(
                  (item: any, index: number) => ({
                    ...item,
                    id: index + 1,
                    transactionDate: item.transactionDate?.split(" ")[0],
                  })
                );
                setUnlistedData(filteredResponse);
                setEditData(null);
              }
            })
            .catch((error) => {
              console.log("ERRRRORR", error);
            });
        }
      })
      .catch((Error) => {
        console.log("Errror", Error);
        dispatch(hideLoader());
      });
  };

  const handleEditClick = (data: any, editCheck: boolean) => {
    console.log("TestModalData", data, editCheck);
    // const formattedDate = data.DateOfCommunication
    //   ? dayjs(data.DateOfCommunication, "DD-MMM-YY").format("DD/MM/YYYY")
    //   : "";
    // const updatedData = { ...data, DateOfCommunication: formattedDate };

    setmodal_grid(true);
    setEditData(data);
    setEditUserCheck(editCheck);
  };

  const getDeleteUserDetails = async (row: any) => {
    console.log("selectedRowwww", row);
    dispatch(showLoader(""));
    let payload = {
      rowId: row.rowID,
      user_Id: user_id,
    };

    const response = await apiServices.DeleteUnlistedSharesRecord(payload);
    console.log("ResPonseee-->", response);

    if (response?.status === 200) {
      dispatch(hideLoader());
      ShowToast("success", response.data?.message);
      setmodal_grid(false);

      let payload = {
        user_Id: user_id,
      };
      const viewResponse = await apiServices.ViewUnlistedSharesRecord(payload);
      console.log("viewResponse123", viewResponse?.data);
      const filteredResponse = viewResponse?.data?.data?.map(
        (item: any, index: number) => ({
          ...item,
          id: index + 1,
          transactionDate: item.transactionDate?.split(" ")[0],
        })
      );
      setUnlistedData(filteredResponse);
    } else {
      throw new Error("Submission failed.");
    }
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  <h4 className="card-title mb-0">Unlisted Shares Status</h4>
                  {activeSubItem === "Unlisted Shares Entry" && (
                    <Button
                      type="submit"
                      variant="contained"
                      className="btn-font"
                      onClick={tog_grid}
                      style={{
                        backgroundColor: "#11395C",
                        height: "32px",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textTransform: "none",
                        borderRadius: "6px",
                      }}
                    >
                      Add
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                {" "}
                <Box>
                  <ModalComponent
                    modal_grid={modal_grid}
                    tog_grid={tog_grid}
                    editData={editData}
                    onSubmit={handleFormSubmit}
                    editUserCheck={editUserCheck}
                    isUnlistedContent={true}
                    activeSubItem={activeSubItem}
                  />
                </Box>
                <DataTable
                  activeSubItem={activeSubItem}
                  T6Data={unlistedData}
                  handleEditClick={handleEditClick}
                  getUserDetails={getDeleteUserDetails}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default InsertUnlistedShares;
