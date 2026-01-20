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
  summary: {
    tcnt?: number;
    dcnt?: number;
    icnt?: number;
    sub_tot?: number;
    sub_dir?: number;
    sub_ind?: number;
    cmp_tot?: number;
    cmp_dir?: number;
    cmp_ind?: number;
  };
}

const AmcReport = ({ activeSubItem }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data || {}
  );

  const [userData, setUserData] = useState<UserData>({
    direct: [],
    inDirect: [],
    summary: {},
  });
  const [activeBranch, setActiveBranch] = useState<"direct" | "indirect">(
    "direct"
  );
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [extendedData, setExtendedData] = useState<any>(null);

  const [selectedType, setSelectedType] = useState<any>();
  const [isNudgeTableOpen, setIsNudgeTableOpen] = useState(false);
  // const [segmentRow, setSegmentRow] = useState(null);

  useEffect(() => {
    if (accessType === "ALL" && selectedZone === "all") return;
    const fetchAMCZoneReport = async () => {
      const payload = {
        zone: selectedZone || "all",
        userId: user_id,
        optionType: "all",
      };

      dispatch(showLoader(""));

      try {
        const response = await apiServices.GetAMCZoneReport(payload);

        if (response?.data?.statusCode === 200) {
          const data = response.data.data;

          const directData =
            data.direct?.map((item: any, index: number) => ({
              ...item,
              Id: index + 1,
            })) || [];

          const inDirectData =
            data.inDirect?.map((item: any, index: number) => ({
              ...item,
              Id: index + 1,
            })) || [];

          setUserData({
            direct: directData,
            inDirect: inDirectData,
            summary: data.summary || {},
          });
        }
      } catch (error) {
        console.error("Error fetching AMC Zone Report:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchAMCZoneReport();
  }, [dispatch, user_id, selectedZone, accessType]);

  const fetchAmcExtended = async (row: any) => {
    console.log("Row11", row);

    console.log(fetchAmcExtended, row);

    const payload = {
      userId: user_id,
      empOrAPCode: row.emp,
      branchType: row.bt,
    };

    dispatch(showLoader(""));

    try {
      const response = await apiServices.GetDPAMCZoneReportDetails(payload);

      if (response?.data?.statusCode === 200) {
        const data = response.data.data;
        console.log(data, "GetDPAMCZoneReportDetails");

        setExtendedData(data);
      }
    } catch (error) {
      console.error("Error fetching AMC Zone Report:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleExtendedVersion = (row: any, type: any) => {
    console.log("Test1111", row, type);
    setExtendedData(null);
    fetchAmcExtended(row);
    setSelectedType(type);
    setIsNudgeTableOpen(true);
    console.log(row, type, "row-----type");
  };

  // useEffect(() => {
  //   console.log(segmentRow, "segmentRow from amc report");
  // }, [segmentRow]);

  const handleZoneChange = (zone: any) => {
    console.log("Selected zone:", zone);
    setSelectedZone(zone?.value || "all"); // update selected zone value here
  };

  // Track active badge per card (0: Total, 1: Submitted, 2: Completed)
  // Each can be 'total', 'direct', or 'indirect'
  const [activeBadges, setActiveBadges] = useState<string[]>([
    "total",
    "total",
    "total",
  ]);

  const handleBadgeClick = (cardIndex: number, type: string) => {
    setActiveBadges((prev) => {
      const updated = [...prev];
      updated[cardIndex] = type;
      return updated;
    });
  };

  // Return value based on card index and active badge
  const getMetricValue = (cardIndex: number) => {
    const badge = activeBadges[cardIndex];
    const data = userData.summary;

    switch (cardIndex) {
      case 0: // Total Clients
        if (badge === "total") return data.tcnt || 0;
        if (badge === "direct") return data.dcnt || 0;
        if (badge === "indirect") return data.icnt || 0;
        break;

      case 1: // Submitted Clients
        if (badge === "total") return data.sub_tot || 0;
        if (badge === "direct") return data.sub_dir || 0;
        if (badge === "indirect") return data.sub_ind || 0;
        break;

      case 2: // Completed Clients
        if (badge === "total") return data.cmp_tot || 0;
        if (badge === "direct") return data.cmp_dir || 0;
        if (badge === "indirect") return data.cmp_ind || 0;
        break;

      default:
        return 0;
    }
  };

  const summaryMetrics = [
    { title: "Total Clients" },
    { title: "Submitted Clients" },
    { title: "Completed Clients" },
  ];

  const closeNudgeTable = () => {
    setIsNudgeTableOpen(false);
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        {accessType === "ALL" && (
          <Card style={{ marginTop: "2rem", padding: "1rem" }}>
            <ComDropDown onZoneChange={handleZoneChange} />
          </Card>
        )}

        <Row>
          {summaryMetrics.map((metric, index) => {
            // Define badges with proper values from summary and active state
            const badges = [
              {
                type: "info",
                label: "Direct",
                value:
                  index === 0
                    ? userData.summary.dcnt || 0
                    : index === 1
                    ? userData.summary.sub_dir || 0
                    : userData.summary.cmp_dir || 0,
                isActive: activeBadges[index] === "direct",
                onClick: () => handleBadgeClick(index, "direct"),
              },
              {
                type: "primary",
                label: "Indirect",
                value:
                  index === 0
                    ? userData.summary.icnt || 0
                    : index === 1
                    ? userData.summary.sub_ind || 0
                    : userData.summary.cmp_ind || 0,
                isActive: activeBadges[index] === "indirect",
                onClick: () => handleBadgeClick(index, "indirect"),
              },
              {
                type: "warning",
                label: "Total",
                value:
                  index === 0
                    ? userData.summary.tcnt || 0
                    : index === 1
                    ? userData.summary.sub_tot || 0
                    : userData.summary.cmp_tot || 0,
                isActive: activeBadges[index] === "total",
                onClick: () => handleBadgeClick(index, "total"),
              },
            ];

            return (
              <Col
                key={index}
                xxl={4}
                lg={4}
                md={4}
                sm={12}
                style={{ marginBottom: "1rem" }}
              >
                <DashboardCard
                  title={metric.title}
                  value={getMetricValue(index)}
                  badges={badges}
                  customZoneClass={true}
                  customClass={true}
                  mainCustomClass={true}
                />
              </Col>
            );
          })}
        </Row>
        <Card
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
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h4 className="card-title mb-0">
                AMC Contest Report{" "}
                <span style={{ fontSize: "12px" }}>(October–December)</span>
              </h4>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
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
          onClose={closeNudgeTable}
          selectedReport={"AMC Contest Report"}
          singleData={extendedData}
          selectedTab={selectedType}
        />
      </Container>
    </div>
  );
};

export default AmcReport;
