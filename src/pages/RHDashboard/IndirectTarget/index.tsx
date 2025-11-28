import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";
import { useFormik } from "formik";
import DashboardCard from "../../../components/common/DashboardCard";
// import { useTheme } from "@mui/material";
import UserInfoTable from "../../../components/common/UserInfoTable";

interface FormValues {
  selectedZone: { label: string; value: string } | null;
}

interface APInfo {
  apCode: string;
  apName: string;
}

const randomAPList: APInfo[] = [
  { apCode: "AP7834", apName: "Radhika Financial Services" },
  { apCode: "AP9127", apName: "Shree Capital Advisors" },
  { apCode: "AP4509", apName: "Vertex Wealth Creators" },
  { apCode: "AP6291", apName: "Prime Equity Solutions" },
  { apCode: "AP3018", apName: "EverGrow Investments" },
  { apCode: "AP5582", apName: "BluePeak Securities" },
  { apCode: "AP8471", apName: "Fortune Trading Hub" },
  { apCode: "AP1943", apName: "Skyline Investment Partners" },
  { apCode: "AP6725", apName: "Apex Securities & Traders" },
  { apCode: "AP2390", apName: "Zenith Capital Associates" },
];

const randomBrokerage = () =>
  Number((Math.random() * 500000 + 10000).toFixed(2)); // 10k – 5L

const generateAPRows = () =>
  randomAPList.map((ap, index) => ({
    id: index + 1,
    apCode: ap.apCode,
    apName: ap.apName,
    q1: randomBrokerage(),
    q2: randomBrokerage(),
    q3: randomBrokerage(),
    q4: randomBrokerage(),
  }));

const IndirectTarget = ({ activeSubItem }: { activeSubItem: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  // const theme = useTheme();

  const [zoneList, setZoneList] = useState([]);

  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik<FormValues>({
    initialValues: { selectedZone: null },
    onSubmit: () => {},
  });

  useEffect(() => {
    if (accessType !== "ALL") return;

    const parts = user_id?.split("-");
    const extractedId = parts?.[1] || null;

    const payload = {
      user_id: user_id === "APN-7161" ? "5376" : extractedId,
      option: "zone",
      userType:
        user_id === "APN-7161"
          ? "EMP"
          : localStorage.getItem("uIdType") === "Employee"
          ? "EMP"
          : "APN",
      zone: "ALL",
    };

    const headers = {
      Authorization: `Basic ${btoa("admin:admin")}`,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .getDropDown(payload, headers)
      .then((res) => {
        if (res?.status !== 200) return;

        const dropdown = res.data.map((item: any) => ({
          label: item.itemDesc,
          value: item.itemVal,
        }));

        setZoneList(dropdown);
        if (dropdown.length) formik.setFieldValue("selectedZone", dropdown[0]);
      })
      .catch((err) => {
        ShowToast("error", err?.response?.data?.message);
      })
      .finally(() => dispatch(hideLoader()));
  }, [accessType]);

  const apGrossBrokerageRows = useMemo(generateAPRows, []);

  return (
    <div className="page-content page-view">
      <div className="container-fluid">
        <Row>
          <Col lg={12}>
            {accessType === "ALL" && (
              <Card style={{ marginBottom: "1px" }}>
                <Row className="m-2">
                  <Col xs={12} className="d-flex align-items-center">
                    <Label className="mb-0 me-2">Zone</Label>

                    <div className="d-flex gap-2 overflow-auto flex-nowrap">
                      {zoneList.map((zone: any) => {
                        const selected =
                          formik.values.selectedZone?.value === zone.value;

                        return (
                          <Button
                            key={zone.value}
                            size="sm"
                            style={{
                              minWidth: 60,
                              whiteSpace: "nowrap",
                              border: "1px solid #11395c",
                              borderRadius: "6px",
                              backgroundColor: selected ? "#11395c" : "#fff",
                              color: selected ? "#fff" : "#11395c",
                            }}
                            onClick={() =>
                              formik.setFieldValue("selectedZone", zone)
                            }
                          >
                            {zone.label}
                          </Button>
                        );
                      })}
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            <Row className="my-2">
              {[
                { title: "Q1 Gross Brokerage", value: 150 },
                { title: "Q2 Gross Brokerage", value: 250 },
                { title: "Q3 Gross Brokerage", value: 350 },
                { title: "Q4 Gross Brokerage", value: 450 },
              ].map((card, i) => (
                <Col key={i} xxl={3} lg={3} md={6} sm={12}>
                  <DashboardCard
                    title={card.title}
                    value={card.value}
                    customClass
                  />
                </Col>
              ))}
            </Row>
            <Card
              style={{
                // minHeight: "55vh",
                borderRadius: 15,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <CardHeader
                style={{
                  borderRadius: "15px 15px 0 0",
                  backgroundColor: "#fff",
                  //   padding: "0.6rem 1rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h4 className="card-title mb-0">{activeSubItem}</h4>
              </CardHeader>

              <CardBody>
                <UserInfoTable
                  activeSubItem={activeSubItem}
                  T6Data={apGrossBrokerageRows}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default IndirectTarget;
