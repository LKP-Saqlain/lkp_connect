import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
} from "reactstrap";
import { Tabs, Tab } from "@mui/material";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ComDropDown from "../../../components/common/Dropdown/commonDropdown";
import DashboardCard from "../../../components/common/DashboardCard";
import UserInfoTable from "../../../components/common/UserInfoTable";
import NudgeTable from "../../../components/common/NudgeTable";

interface UserData {
  direct: any[];
  inDirect: any[];
  summary: Record<string, number>;
}

const TAB_CONFIG = [
  { label: "Q3", optionType: "Q3", period: "October–December" },
  { label: "Q4", optionType: "Q4", period: "January–March" },
];

const SUMMARY_KEYS = [
  { title: "Total Clients", keys: ["tcnt", "dcnt", "icnt"] },
  { title: "Submitted Clients", keys: ["sub_tot", "sub_dir", "sub_ind"] },
  { title: "Completed Clients", keys: ["cmp_tot", "cmp_dir", "cmp_ind"] },
];

const AmcReport = ({ activeSubItem }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(1);
  const [activeBranch, setActiveBranch] = useState<"direct" | "indirect">(
    "direct"
  );
  const [selectedZone, setSelectedZone] = useState("all");
  const [activeBadges, setActiveBadges] = useState(["total", "total", "total"]);
  const [extendedData, setExtendedData] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>();
  const [isNudgeTableOpen, setIsNudgeTableOpen] = useState(false);

  const { user_id } = useSelector((s: RootState) => s.UserLogin?.data?.data);
  const { accessType } = useSelector(
    (s: RootState) => s.AuthUser?.data?.data || {}
  );

  const [userData, setUserData] = useState<UserData>({
    direct: [],
    inDirect: [],
    summary: {},
  });

  useEffect(() => {
    if (accessType === "ALL" && selectedZone === "all") return;

    const fetchReport = async () => {
      dispatch(showLoader(""));

      try {
        const res = await apiServices.GetAMCZoneReport({
          userId: user_id,
          zone: selectedZone,
          optionType: TAB_CONFIG[tabValue].optionType,
        });

        if (res?.data?.statusCode === 200) {
          const { direct = [], inDirect = [], summary = {} } = res.data.data;
          setUserData({
            direct: direct.map((d: any, i: number) => ({ ...d, Id: i + 1 })),
            inDirect: inDirect.map((d: any, i: number) => ({
              ...d,
              Id: i + 1,
            })),
            summary,
          });
        }
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchReport();
  }, [tabValue, selectedZone, accessType, user_id, dispatch]);

  const fetchExtended = async (row: any) => {
    dispatch(showLoader(""));
    try {
      const res = await apiServices.GetDPAMCZoneReportDetails({
        userId: user_id,
        empOrAPCode: row.emp,
        branchType: row.bt,
      });
      if (res?.data?.statusCode === 200) setExtendedData(res.data.data);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleBadgeClick = (idx: number, type: string) =>
    setActiveBadges((p) => p.map((v, i) => (i === idx ? type : v)));

  const getMetricValue = (i: number) => {
    const badge = activeBadges[i];
    const [total, direct, indirect] = SUMMARY_KEYS[i].keys;
    return (
      userData.summary[
        badge === "direct" ? direct : badge === "indirect" ? indirect : total
      ] || 0
    );
  };

  const handleExtendedVersion = (row: any, type: any) => {
    setExtendedData(null);
    fetchExtended(row);
    setSelectedType(type);
    setIsNudgeTableOpen(true);
  };

  const renderSummaryCards = () => (
    <Row>
      {SUMMARY_KEYS.map((m, i) => (
        <Col key={i} xxl={4} lg={4} md={4} sm={12}>
          <DashboardCard
            title={m.title}
            value={getMetricValue(i)}
            badges={[
              {
                type: "info",
                label: "Direct",
                value: userData.summary[m.keys[1]] || 0,
                isActive: activeBadges[i] === "direct",
                onClick: () => handleBadgeClick(i, "direct"),
              },
              {
                type: "primary",
                label: "Indirect",
                value: userData.summary[m.keys[2]] || 0,
                isActive: activeBadges[i] === "indirect",
                onClick: () => handleBadgeClick(i, "indirect"),
              },
              {
                type: "warning",
                label: "Total",
                value: userData.summary[m.keys[0]] || 0,
                isActive: activeBadges[i] === "total",
                onClick: () => handleBadgeClick(i, "total"),
              },
            ]}
            customZoneClass
            customClass
            mainCustomClass
          />
        </Col>
      ))}
    </Row>
  );

  const renderAMCReport = () => (
    <>
      {renderSummaryCards()}

      <Card
        className="mt-3"
        style={{
          minHeight: "80vh",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          // marginTop: "17px",
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
          <div className="d-flex justify-content-between">
            <h4 className="card-title mb-0">
              AMC Contest Report{" "}
              <span style={{ fontSize: "12px" }}>
                ({TAB_CONFIG[tabValue].period})
              </span>
            </h4>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Button
                type="button"
                onClick={() => setActiveBranch("direct")}
                style={{
                  backgroundColor:
                    activeBranch === "direct" ? "#11395C" : "#ffffff",
                  color: activeBranch === "direct" ? "#ffffff" : "#11395C",
                  border: "1px solid #11395C",
                  minWidth: "80px",
                  fontSize: "14px",
                  borderRadius: "6px",
                }}
              >
                Direct
              </Button>

              <Button
                type="button"
                onClick={() => setActiveBranch("indirect")}
                style={{
                  backgroundColor:
                    activeBranch === "indirect" ? "#F57C00" : "#ffffff",
                  color: activeBranch === "indirect" ? "#ffffff" : "#F57C00",
                  border: "1px solid #F57C00",
                  minWidth: "80px",
                  fontSize: "14px",
                  borderRadius: "6px",
                }}
              >
                Indirect
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <UserInfoTable
            T6Data={
              activeBranch === "direct" ? userData.direct : userData.inDirect
            }
            activeSubItem={`${activeSubItem} ${activeBranch}`}
            handleDownload={handleExtendedVersion}
          />
        </CardBody>
      </Card>

      <NudgeTable
        isOpen={isNudgeTableOpen}
        onClose={() => setIsNudgeTableOpen(false)}
        selectedReport="AMC Contest Report"
        singleData={extendedData}
        selectedTab={selectedType}
      />
    </>
  );

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            mt: "1rem",
            mb: "8px",
            backgroundColor: "white",
            borderRadius: "7px",
            width: "fit-content",
            minHeight: "28px", // 👈 reduce Tabs height
            height: "28px",
            // padding: "2px",
          }}
        >
          <Tab
            label="Q3"
            sx={{
              textTransform: "none",
              fontWeight: 400,
              borderRadius: "7px",
              px: 3,
              minHeight: "28px", // 👈 reduce Tab height
              height: "28px",
              lineHeight: "28px", // 👈 vertical centering
              backgroundColor: tabValue === 0 ? "#11395C" : "white",
              color: tabValue === 0 ? "white" : "#11395C",
              "&.Mui-selected": {
                color: "white !important",
              },
            }}
          />

          <Tab
            label="Q4"
            sx={{
              textTransform: "none",
              fontWeight: 400,
              borderRadius: "7px",
              px: 3,
              minHeight: "28px",
              height: "28px",
              lineHeight: "28px",
              backgroundColor: tabValue === 1 ? "#11395C" : "white",
              color: tabValue === 1 ? "white" : "#11395C",
              "&.Mui-selected": {
                color: "white !important",
              },
            }}
          />
        </Tabs>

        {accessType === "ALL" && (
          <ComDropDown
            onZoneChange={(z: any) => setSelectedZone(z?.value || "all")}
          />
        )}

        {renderAMCReport()}
      </Container>
    </div>
  );
};

export default AmcReport;
