import React, { useCallback, useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import { apiServices } from "../../../services";
import { TextField, Button, Grid, Box } from "@mui/material";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import ShowToast from "../../../utils/toastUtils";
// import { encryptAES } from "../../../utils/encryptDecrypt";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../../assets/logo.png";
import UserInfoTable from "../../../components/common/UserInfoTable";
// import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import { decryptAES } from "../../../utils/encryptDecrypt";

const MandateCall = () => {
  const [data, setData] = useState<any>(null);
  const [mandateCallBackData, setMandateCallbackData] = useState<any>(null);
  const [upiId, setUpiId] = useState("");
  const [isMandateEnabled, setIsMandateEnabled] = useState(false);
  const [amount, setAmount] = useState("5000");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // const { user_id } = useSelector(
  //   (state: RootState) => state.UserLogin?.data?.data
  // );

  const { encryptedCode } = useParams<{ encryptedCode: string }>();

  //  Normalize it once — decode URL and fix "+" issue
  const normalizedCode = decodeURIComponent(encryptedCode || "").replace(
    / /g,
    "+"
  );

  // (Optional) Decrypt only if you need to display the client code locally
  const decryptCode = normalizedCode ? decryptAES(normalizedCode) : "";

  useEffect(() => {
    if (!encryptedCode) return;

    dispatch(showLoader(""));

    apiServices
      .GetDpClientDetails({ clientcode: encryptedCode })
      .then((response) => {
        if (response?.status === 200) {
          setData(response.data.data);
        }
      })
      .catch((err) => console.error("Error", err))
      .finally(() => {
        dispatch(hideLoader());
        // navigate(`/DPMandate/${encryptedCode}`);
      });
  }, [encryptedCode, dispatch, navigate]);

  const fetchMandateData = useCallback(() => {
    if (!decryptCode) return;
    let payload = {
      clientcode: decryptCode,
      // user_id: user_id,
    };
    console.log("payload", payload);

    dispatch(showLoader(""));
    apiServices
      .GetMandateCallBackDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          const rawData = response?.data?.data;

          if (Array.isArray(rawData)) {
            const formattedData = rawData.map((item: any, index: number) => ({
              id: index + 1,
              ...item,
            }));
            setMandateCallbackData(formattedData);
          } else {
            console.warn("Unexpected response format:", rawData);
            setMandateCallbackData([]); // fallback to empty
          }
        }
      })
      .catch((err) => console.error("Error", err))
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [decryptCode, dispatch]);

  const HandleVerifyUpi = () => {
    const payload = {
      requestInfo: {
        pgMerchantId: "",
        pspRefNo: "",
      },
      payeeType: {
        virtualAddress: upiId,
      },
    };

    dispatch(showLoader(""));

    apiServices
      .checkUpi(JSON.stringify(payload))
      .then((response) => {
        console.log("UPI Verified", response?.data);

        // Check inner statusCode from API response
        if (response?.data?.statusCode === 400) {
          ShowToast("error", response?.data?.message || "Invalid UPI ID");
          setIsMandateEnabled(false);
          dispatch(hideLoader());
          return; // stop execution here
        }

        // If success
        if (response?.data?.isSuccess) {
          ShowToast(
            "success",
            response?.data?.message || "UPI Verified Successfully"
          );
          setIsMandateEnabled(true);
        } else {
          ShowToast("error", response?.data?.message || "Something went wrong");
          setIsMandateEnabled(false);
        }

        dispatch(hideLoader());
      })
      .catch((error) => {
        console.log("error", error);
        ShowToast("error", "Failed to verify UPI ID");
        setIsMandateEnabled(false);
        dispatch(hideLoader());
      });
  };

  const HandleMandate = () => {
    let payload = {
      clientcode: data?.clientcode,
      // user_id: user_id,
      dpCode: data?.dpcode,
      dpid: data?.dpid,
      amount: amount,
      upiID: upiId,
    };
    dispatch(showLoader(""));
    apiServices
      .CreateUpiMandate(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("mandateResponse-->", response?.data);
          setIsMandateEnabled(true); // enable mandate button
          setSuccessMsg(response?.data?.message);
          ShowToast("success", response?.data?.message);
        }
        dispatch(hideLoader());
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(hideLoader());
      });
  };

  const formatIndianNumber = (value: string) => {
    if (!value) return "";
    return new Intl.NumberFormat("en-IN").format(Number(value));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");

    if (rawValue === "" || /^[0-9]+$/.test(rawValue)) {
      setAmount(rawValue);
    }
  };
  const handleAmountBlur = () => {
    const numericValue = Number(amount);

    if (numericValue < 5000) {
      ShowToast("error", "Amount must be at least ₹5,000");
      setAmount("5000");
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}${month}${year}`; // DDMMYYYY
  };

  const handleUpdate = (data: any) => {
    console.log("data", data);

    let payload = {
      requestInfo: {
        pgMerchantId: "",
        pspRefNo: "",
      },
      mandate: {
        txn_id: "",
        amount: amount,
        amt_rule: "MAX",
        recurrence: {
          pattern: "MONTHLY",
          ruleType: "ON",
          ruleValue: data?.ruleValue?.toString() ?? "",
          startDate: formatDate(data?.startdate),
          endDate: formatDate(data?.Enddate),
        },
        action_type: "UPDATE",
        onBehalf_Of: "PAYEE",
        expiryTime: "180",
        umn: data?.umn,
      },
    };
    dispatch(showLoader(""));
    apiServices
      .UpdateUpiMandate(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          console.log("response1", response?.data?.data?.statusDesc);
          ShowToast("success", response?.data?.data?.statusDesc);
        }
      })
      .catch((errror) => {
        console.log("error", errror);
        dispatch(hideLoader());
      });
  };

  const getRevokeDetails = (value: any) => {
    console.log("Vallues", value);

    let payload = {
      requestInfo: {
        pgMerchantId: "",
        pspRefNo: "",
      },
      mandate: {
        amount: value?.amount.toString(),
        action_type: "REVOKE",
        onBehalf_Of: "PAYEE",
        UMN: value?.umn,
      },
    };
    dispatch(showLoader(""));
    apiServices
      .RevokeUpiMandate(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("respinsesse", response?.data);
          if (response?.data?.statusCode === 200) {
            ShowToast("success", response?.data?.data?.statusDesc);
          } else {
            ShowToast("error", response?.data?.data?.statusDesc);
          }
          dispatch(hideLoader());
        }
      })
      .catch((error) => {
        console.log("Errrror", error);
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    fetchMandateData();
  }, [fetchMandateData]);

  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  margin: "20px auto",
                  minWidth: "1000px",
                  width: "100%",
                }}
              >
                <CardHeader
                  style={{
                    borderRadius: "6px 6px 0 0",
                    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "rgb(238, 238, 238)",
                    padding: "0.5rem 1rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <img src={Logo} alt="Logo" style={{ height: "40px" }} />
                  </Box>
                  <h4 className="card-title mb-0">DP Mandate Call</h4>
                </CardHeader>

                <CardBody
                  style={{
                    backgroundColor: "#F8F8F8",
                  }}
                >
                  {data ? (
                    <Table bordered hover responsive>
                      <thead style={{ textAlign: "center" }}>
                        <tr>
                          <th
                            style={{
                              backgroundColor: "#11395C",
                              color: "#FFF",
                              border: "1px solid #11395C",
                            }}
                          ></th>
                          <th
                            style={{
                              backgroundColor: "#11395C",
                              color: "#FFF",
                              border: "1px solid #11395C",
                              paddingBottom: "20px",
                            }}
                          >
                            {" "}
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        style={{
                          textAlign: "center",
                          border: "1px solid #11395C",
                        }}
                      >
                        <tr>
                          <td>Client Name</td>
                          <td>{data.clientName}</td>
                        </tr>
                        <tr></tr>
                        <tr>
                          <td>Client Code</td>
                          <td>{data.clientcode}</td>
                        </tr>
                        <tr>
                          <td>DP Code</td>
                          <td>{data.dpcode}</td>
                        </tr>
                        <tr>
                          <td>DP ID</td>
                          <td>{data.dpid}</td>
                        </tr>
                      </tbody>
                    </Table>
                  ) : (
                    <p>Loading...</p>
                  )}

                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    style={{ marginTop: "20px" }}
                  >
                    {/* Amount Field */}
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        size="small"
                        label="Please Enter Amount"
                        variant="outlined"
                        fullWidth
                        onBlur={handleAmountBlur}
                        value={formatIndianNumber(amount)}
                        onChange={handleAmountChange}
                      />
                    </Grid>

                    {/* UPI Field */}
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        size="small"
                        label="Enter UPI ID"
                        variant="outlined"
                        fullWidth
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          setIsMandateEnabled(false);
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                      <Button
                        variant="contained"
                        // color="primary"
                        sx={{ backgroundColor: "#11395C" }}
                        fullWidth
                        onClick={HandleVerifyUpi}
                      >
                        Verify UPI
                      </Button>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        disabled={!isMandateEnabled}
                        onClick={HandleMandate}
                      >
                        Mandate
                      </Button>
                    </Grid>
                  </Grid>

                  {successMsg && (
                    <div
                      style={{
                        fontSize: "13px",
                        marginTop: "15px",
                        padding: "10px 15px",
                        backgroundColor: "#d4edda",
                        color: "#155724",
                        borderRadius: "6px",
                        fontWeight: 500,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        width: "100%",
                        maxWidth: "400px",
                      }}
                    >
                      {`${successMsg}! Mandate Initiated, waiting for confirmation.`}
                    </div>
                  )}
                  <Card style={{ marginTop: "10px" }}>
                    <CardHeader
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Mandate Status</span>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: "none",
                          borderRadius: "16px",
                          fontSize: "0.8rem",
                          padding: "2px 8px",
                          color: "#11395C",
                        }}
                        onClick={fetchMandateData}
                      >
                        Refresh {<RefreshIcon sx={{ fontSize: "1.1rem" }} />}
                      </Button>
                    </CardHeader>

                    <CardBody>
                      <UserInfoTable
                        activeSubItem={"mandateCall"}
                        T6Data={mandateCallBackData}
                        handleUpdate={handleUpdate}
                        getUserDetails={getRevokeDetails}
                      />
                    </CardBody>
                  </Card>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MandateCall;
