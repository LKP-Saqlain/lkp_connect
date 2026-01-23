import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RootState, AppDispatch } from "../../redux/store";
import { apiServices } from "../../services";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { Tabs, Tab } from "@mui/material";
import DataTable from "../../components/common/UserInfoTable";

type ExpiryData = any[];

const Expiry = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const [tabValue, setTabValue] = useState(0);
  const [employeeData, setEmployeeData] = useState<ExpiryData>([]);
  const [clientData, setClientData] = useState<ExpiryData>([]);
  const [zoneData, setZoneData] = useState<ExpiryData>([]);

  const symbol = tabValue === 0 ? "sensex" : "nifty";

  const fetchExpiryData = useCallback(
    async (apiFn: Function, setter: Function) => {
      try {
        const payload = { user_id, symbol };
        const response = await apiFn(payload);

        if (response?.status === 200) {
          const mappedData =
            (response?.data?.data || []).map((item: any, index: number) => ({
              Id: index + 1,
              ...item,
            })) || [];

          setter(mappedData);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    },
    [user_id, symbol]
  );

  useEffect(() => {
    dispatch(showLoader(""));

    Promise.all([
      fetchExpiryData(apiServices.GetEmployeeExpiryDetails, setEmployeeData),
      fetchExpiryData(apiServices.GetClientExpiryDetails, setClientData),
      fetchExpiryData(apiServices.GetZoneExpiryDetails, setZoneData),
    ]).finally(() => dispatch(hideLoader()));
  }, [fetchExpiryData, dispatch]);

  const cardsConfig = [
    {
      title: "Employee Wise Details",
      data: employeeData,
    },
    {
      title: "Client Wise Details",
      data: clientData,
    },
    {
      title: "Zone Wise Details",
      data: zoneData,
    },
  ];

  return (
    <div className="page-content page-view">
      <div className="container-fluid">
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            mt: "1rem",
            ml: ".7rem",
            mb: "8px",
            backgroundColor: "white",
            borderRadius: "11px",
            width: "fit-content",
            minHeight: 0,
          }}
        >
          {["Sensex", "Nifty"].map((label, index) => (
            <Tab
              key={label}
              label={label}
              sx={{
                textTransform: "none",
                fontWeight: 400,
                borderRadius: "10px",
                px: 3,
                minHeight: 10,
                backgroundColor: tabValue === index ? "#11395C" : "white",
                color: tabValue === index ? "white" : "#11395C",
                "&.Mui-selected": { color: "white" },
              }}
            />
          ))}
        </Tabs>

        {/* Cards */}
        <Row className="row-font">
          {cardsConfig.map(({ title, data }) => (
            <Col lg={12} key={title}>
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
                    backgroundColor: "#fff",
                    padding: "0.2rem 0.8rem",
                  }}
                >
                  <h4 className="card-title mb-0">{title}</h4>
                </CardHeader>
                <CardBody>
                  <DataTable activeSubItem={title} T6Data={data} />
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Expiry;
