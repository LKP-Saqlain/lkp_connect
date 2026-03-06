import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import * as Yup from "yup";
import { useFormik } from "formik";
import NudgeTable from "../../../components/common/NudgeTable";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import ShowToast from "../../../utils/toastUtils";

type SelectOption = {
  label: string;
  value: string | number;
};

type StopLossFormValues = {
  selectedZone: SelectOption | null;
  selectedMonth: SelectOption | null;
};

const zoneOptions = [
  { label: "SPIP", value: "SPIP" },
  { label: "Trilogy", value: "Trilogy" },
];

const StopLoss = ({ activeSubItem }: any) => {
  const [monthOptions, setMonthOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const [isNudgeTableOpen, setIsNudgeTableOpen] = useState(false);
  const [extendedData, setExtendedData] = useState<any>(null);
  const [apiCallCheck, setApiCallCheck] = useState(false);
  const [mainData, setMainData] = useState<any[]>([]);
  const [detailData, setDetailData] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [priceType, setPriceType] = useState("stoploss");
  const [price, setPrice] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const validationSchema = Yup.object({
    selectedZone: Yup.object().nullable().required("Please select Zone"),
    selectedMonth: Yup.object().nullable().required("Please select Month"),
  });

  const formik = useFormik<StopLossFormValues>({
    initialValues: {
      selectedZone: null,
      selectedMonth: null,
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        zone: values.selectedZone?.value,
        monthId: values.selectedMonth?.value,
      };

      console.log("Submit Payload:", payload);
      fetchviewGrid(payload);
    },
  });

  const fetchviewGrid = (value: any) => {
    dispatch(showLoader(""));
    setApiCallCheck(false);
    // alert("called");
    console.log("Vallues", value);

    const payload = {
      monthId: value?.monthId,
    };

    const spipPayload = {
      quarterId: value?.monthId,
    };

    const apiCall =
      value?.zone === "Trilogy"
        ? apiServices.ViewGrid(payload)
        : apiServices.SPIPViewGrid(spipPayload);

    apiCall
      ?.then((response) => {
        if (response?.status === 200) {
          console.log("Test1234", response?.data?.data);
          const res = response?.data?.data;

          setApiCallCheck(true);
          setMainData(res?.main || []);
          setDetailData(res?.details || []);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleExtendedVersion = () => {
    // setExtendedData(null);
    // fetchExtended(row);
    // setSelectedType(type);
    setIsNudgeTableOpen(true);
    console.log("test12312", formik.values?.selectedMonth?.value);
  };

  const fetchMonths = (zone: string) => {
    dispatch(showLoader(""));

    const apiCall =
      zone === "SPIP"
        ? apiServices.GetSPIPMonths({})
        : apiServices.GetMonths({});

    apiCall
      .then((response) => {
        if (response?.status === 200) {
          const data = response?.data?.data || [];

          const formattedOptions = data.map((item: any) => ({
            label: zone === "SPIP" ? item.quarterName : item.monthName,
            value: zone === "SPIP" ? item.quarterId : item.monthId,
          }));

          setMonthOptions(formattedOptions);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleSelect = (row: any) => {
    setSelectedStock(row);
    console.log("Selected Row:", row);
  };

  const fetchSendEmail = () => {
    console.log("selectedStock11", selectedStock);

    const isSpip = formik.values?.selectedZone?.value === "SPIP";
    const targetPrice = parseFloat(selectedStock?.targetPrice);
    const stoplossPrice = parseFloat(selectedStock?.stoplossPrice);

    const payload = isSpip
      ? {
          quarterId: formik.values?.selectedMonth?.value,
          serialNo: selectedStock?.serialNo,
          symbol: selectedStock?.symbol,
          stoplossPrice: stoplossPrice,
          targetPrice: targetPrice,
          overridePrice: price,
          actionType: priceType === "target" ? "TARGET" : "STOPLOSS",
        }
      : {
          monthId: formik.values?.selectedMonth?.value,
          serialNo: selectedStock?.serialNo,
          symbol: selectedStock?.symbol,
          stoplossPrice: stoplossPrice,
          targetPrice: targetPrice,
          overridePrice: price,
          actionType: priceType === "target" ? "TARGET" : "STOPLOSS",
        };

    dispatch(showLoader(""));

    const apiCall = isSpip
      ? apiServices.SendSpipEmail(payload)
      : apiServices.SendTrilogyEmail(payload);

    apiCall
      .then((response) => {
        if (response?.status === 200) {
          console.log("Response123", response?.data);
          ShowToast("success", response?.data?.message);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
  useEffect(() => {
    if (!apiCallCheck) return;

    const isSpip = formik.values?.selectedZone?.value === "SPIP";

    const payload = isSpip
      ? { emailType: 1, quarterId: formik.values?.selectedMonth?.value }
      : { emailType: 1, monthId: formik.values?.selectedMonth?.value };

    dispatch(showLoader(""));

    const apiCall =
      formik.values?.selectedZone?.value === "SPIP"
        ? apiServices.FetchSPIPClients(payload)
        : apiServices.FetchClients(payload); // default calling Trilogy api he

    apiCall
      .then((response) => {
        if (response?.status === 200) {
          console.log("response12212", response?.data?.data?.data);
          setExtendedData(response?.data?.data?.data);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [apiCallCheck]);

  return (
    <>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <NudgeTable
              isOpen={isNudgeTableOpen}
              onClose={() => setIsNudgeTableOpen(false)}
              selectedReport="Client List"
              singleData={extendedData}
              selectedTab={formik.values.selectedZone?.value}
            />
            <Col lg={12}>
              <Card
                style={{
                  minHeight: "80vh",
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
                  <h4 className="card-title mb-0">{activeSubItem}</h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                    <Row className="align-items-end">
                      <Col xl={3} lg={3} md={4} sm={6} xs={12}>
                        <div
                          style={{
                            minHeight: "70px",
                          }}
                        >
                          <Select
                            value={formik.values.selectedZone}
                            onChange={(option: any) => {
                              formik.setFieldValue("selectedZone", option);
                              formik.setFieldValue("selectedMonth", null);

                              // RESET ALL DATA WHEN ZONE CHANGES
                              setMainData([]);
                              setDetailData([]);
                              setSelectedStock(null);
                              setPrice("");
                              setPriceType("stoploss");
                              setApiCallCheck(false);

                              if (option?.value) {
                                fetchMonths(option.value);
                              }
                            }}
                            onBlur={() =>
                              formik.setFieldTouched("selectedZone", true)
                            }
                            options={zoneOptions}
                            isClearable
                            placeholder="Select Zone"
                          />

                          {formik.touched.selectedZone &&
                            formik.errors.selectedZone && (
                              <div
                                style={{
                                  color: "#D32F2F",
                                  fontSize: "12px",
                                  marginTop: "4px",
                                  position: "absolute",
                                }}
                              >
                                {formik.errors.selectedZone}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Col xl={3} lg={3} md={4} sm={6} xs={12}>
                        <div
                          style={{
                            minHeight: "70px",
                          }}
                        >
                          <Select
                            value={formik.values.selectedMonth}
                            // onChange={(option: any) =>
                            //   formik.setFieldValue("selectedMonth", option)
                            // }
                            onChange={(option: any) => {
                              formik.setFieldValue("selectedMonth", option);
                              setMainData([]);
                              setDetailData([]);
                              setSelectedStock(null);
                              setPrice("");
                              setPriceType("stoploss");
                              setApiCallCheck(false);
                            }}
                            onBlur={() =>
                              formik.setFieldTouched("selectedMonth", true)
                            }
                            options={monthOptions}
                            isClearable
                            placeholder="Select Month"
                          />

                          {formik.touched.selectedMonth &&
                            formik.errors.selectedMonth && (
                              <div
                                style={{
                                  color: "#D32F2F",
                                  fontSize: "12px",
                                  marginTop: "4px",
                                }}
                              >
                                {formik.errors.selectedMonth}
                              </div>
                            )}
                        </div>
                      </Col>
                      <Button
                        style={{
                          backgroundColor: "#11395C",
                          fontSize: "13px",
                          marginBottom: "2rem",
                          minWidth: "140px",
                          width: "15%",
                        }}
                        type="submit"
                      >
                        View
                      </Button>
                      {apiCallCheck && (
                        <Button
                          style={{
                            backgroundColor: "#11395C",
                            fontSize: "13px",
                            marginBottom: "2rem",
                            marginLeft: "1rem",
                            minWidth: "140px",
                            width: "15%",
                          }}
                          onClick={handleExtendedVersion}
                        >
                          Client List
                        </Button>
                      )}
                    </Row>
                  </form>
                  {mainData.length > 0 && (
                    <div
                      style={{
                        border: "1px solid #cfcfcf",
                        marginTop: "20px",
                        background: "#f8f8f8",
                        padding: "10px",
                      }}
                    >
                      {/* TOP HEADER TABLE */}
                      <table
                        className="table table-bordered"
                        style={{ textAlign: "center", marginBottom: "10px" }}
                      >
                        <thead style={{ background: "#1c3c6b", color: "#fff" }}>
                          <tr>
                            <th>Quarter Id</th>
                            <th>Quarter Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                          </tr>
                        </thead>

                        <tbody>
                          {mainData.map((item: any, index: number) => (
                            <tr key={index}>
                              <td>
                                {item.monthId ? item.monthId : item.quarterId}
                              </td>
                              <td>
                                {item.monthName
                                  ? item.monthName
                                  : item.quarterName}
                              </td>
                              <td>{item.startDate?.split(" ")[0]}</td>
                              <td>{item.endDate?.split(" ")[0]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* DETAILS TABLE */}

                      <table
                        className="table table-bordered"
                        style={{
                          textAlign: "center",
                          background: "#fff",
                        }}
                      >
                        <thead style={{ background: "#1c3c6b", color: "#fff" }}>
                          <tr>
                            <th>Select</th>
                            <th>Serial No</th>
                            <th>Symbol</th>
                            <th>Stoploss Price</th>
                            <th>Target Price</th>
                            <th>Buy Price</th>
                          </tr>
                        </thead>

                        <tbody>
                          {detailData.map((row: any, index: number) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedStock?.serialNo === row.serialNo
                                  }
                                  style={{
                                    transform: "scale(1.6)",
                                    cursor: "pointer",
                                    color: "#11395C",
                                  }}
                                  onChange={() => handleSelect(row)}
                                />
                              </td>
                              <td>{row.serialNo}</td>
                              <td>{row.symbol}</td>
                              <td>{row.stoplossPrice}</td>
                              <td>{row.targetPrice}</td>
                              <td>{row.buyPrice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div
                        style={{
                          marginTop: "15px",
                          padding: "15px",
                          borderTop: "1px solid #ddd",
                        }}
                      >
                        <RadioGroup
                          row
                          value={priceType}
                          onChange={(e) => setPriceType(e.target.value)}
                        >
                          <FormControlLabel
                            value="stoploss"
                            control={<Radio size="small" />}
                            label="Stoploss"
                          />
                          <FormControlLabel
                            value="target"
                            control={<Radio size="small" />}
                            label="Target"
                          />
                        </RadioGroup>

                        <div style={{ marginBottom: "10px" }}>
                          <TextField
                            size="small"
                            label="Price"
                            placeholder="Enter Price"
                            value={price}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (/^\d*\.?\d*$/.test(value)) {
                                setPrice(value);
                              }
                            }}
                            inputProps={{
                              inputMode: "decimal",
                            }}
                            sx={{ width: 300 }}
                          />
                        </div>

                        <Button
                          style={{
                            backgroundColor: "#11395C",
                            minWidth: "140px",
                          }}
                          onClick={fetchSendEmail}
                        >
                          Send Message
                        </Button>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default StopLoss;
