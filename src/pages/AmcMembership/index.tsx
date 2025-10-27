import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import UserCapsules from "../ClientDetails/UserCapsules";
import DashboardCard from "../../components/common/DashboardCard";
import { TextField } from "@mui/material";

type DropdownOption = {
  label: string;
  value: string;
};

const Index = ({ activeMenu }: any) => {
  const [selectedCapsule, setSelectedCapsule] = useState("Lifetime Membership");
  const [lifetimeData, setLifetimeData] = useState<any[]>([]);
  const [nonLifetimeData, setNonLifetimeData] = useState<any[]>([]);
  const [contestData, SetContestData] = useState<any[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [incentiveEarned, setIncentiveEarned] = useState(0);
  const [selectedZone, setSelectedZone] = useState<DropdownOption | null>(null);
  const [noSortingGroup, setNoSortingGroup] = useState<DropdownOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );

  const fetchData = () => {
    const payload = {
      zone: selectedZone?.value || "ALL",
      branchCode: "ALL",
      tradingCode: "ALL",
      userId: user_id,
      // zone: "0009",
      // zone: "H.O.",
      // userId: "EMP-0040",
      // branchCode: "BH.O.",
      // branchCode: "B1400",
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetClientModuleDataForAmc(payload)
      .then((response) => {
        const withLifetime = response?.data?.data?.withLifetimeAMC || [];
        const withoutLifetime = response?.data?.data?.withoutLifetimeAMC || [];

        setLifetimeData(
          withLifetime.map((item: any, index: number) => ({
            id: index + 1,
            ...item,
          }))
        );

        setNonLifetimeData(
          withoutLifetime.map((item: any, index: number) => ({
            id: index + 1,
            ...item,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching compliance data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const fetchContestData = () => {
    const payload = {
      zone: selectedZone?.value || "ALL",
      branchcode: "ALL",
      tradingCode: "ALL",
      user_id: user_id,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetClientDPContest(payload)
      .then((response) => {
        const resData = response?.data?.data?.clientModule || [];
        const countDetails =
          response?.data?.data?.dpClientcountdetails?.[0] || {};

        SetContestData(
          resData.map((item: any, index: number) => ({
            id: index + 1,
            ...item,
          }))
        );

        setClientCount(countDetails.traded_Client_Count || 0);
        setIncentiveEarned(countDetails.incentiveEran || 0);
      })
      .catch((error) => {
        console.error("Error fetching contest data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    const fetchZones = async () => {
      const userType =
        localStorage.getItem("uIdType") === "Employee" ? "EMP" : "APN";

      const payload = {
        user_id: user_id,
        option: "zone",
        userType,
        zone: "ALL",
      };

      try {
        dispatch(showLoader("Please wait, we are processing your request..."));

        const res = await apiServices.getDropDown(payload);
        if (res?.status === 200) {
          const zoneOptions = res.data.map((item: any) => ({
            label: item.itemDesc,
            value: item.itemVal,
          }));

          setNoSortingGroup(zoneOptions);
          if (zoneOptions.length > 0) {
            setSelectedZone(zoneOptions[0]); // Pre-select first zone
          }
        }
      } catch (err: any) {
        console.log("err", err);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchZones();
  }, [dispatch, user_id]);

  useEffect(() => {
    if (selectedCapsule === "Contest Earned") {
      fetchContestData();
    } else {
      fetchData();
    }
  }, [selectedZone, selectedCapsule]);

  const tableData =
    selectedCapsule === "Lifetime Membership"
      ? lifetimeData
      : selectedCapsule === "Non-Lifetime Membership"
      ? nonLifetimeData
      : contestData;

  const filteredData = tableData.filter((item: any) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      item?.trading_Code?.toLowerCase().includes(search) ||
      item?.primary_Holder?.toLowerCase().includes(search) ||
      item?.dP_ID?.toLowerCase().includes(search) ||
      item?.dp_Id?.toLowerCase().includes(search)
    );
  });

  const handleClick = (value: string) => {
    console.log(activeMenu, "You clicked the Chip.", value);
    setSelectedCapsule(value);
  };

  return (
    <div className="page-content page-view">
      <UserCapsules
        selectedCapsule={selectedCapsule}
        capsuleType="AMC Membership"
        handleClick={handleClick}
      />

      {selectedCapsule === "Contest Earned" && (
        <Row style={{ margin: "10px" }}>
          <Col xxl={3} lg={3} md={6} sm={12}>
            <DashboardCard
              title="Client Count"
              value={clientCount}
              customClass={true}
            />
          </Col>
          <Col xxl={3} lg={3} md={6} sm={12}>
            <DashboardCard
              title="Incentive Earned"
              value={incentiveEarned}
              customClass={true}
              suffix=".00"
            />
          </Col>
        </Row>
      )}

      <Container fluid>
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4 className="card-title mb-0 text-center">
              DP AMC {selectedCapsule}
            </h4>
          </CardHeader>

          <CardBody>
            <Row className="align-items-end flex-wrap" style={{ gap: "1rem" }}>
              {accessType === "ALL" && selectedCapsule !== "Contest Earned" && (
                <Row>
                  <div className="d-flex align-items-center gap-2">
                    <Label className="form-label text-muted label-font mb-0">
                      Zone
                    </Label>
                    <div
                      className="d-flex flex-nowrap gap-2 overflow-auto mt-1"
                      style={{ maxWidth: "100%" }}
                    >
                      {noSortingGroup.map((zone: any) => {
                        const isSelected = selectedZone?.value === zone.value;
                        return (
                          <Button
                            key={zone.value}
                            type="button"
                            style={{
                              minWidth: "60px",
                              whiteSpace: "nowrap",
                              fontSize: "12px",
                              padding: "2px 8px",
                              borderRadius: "6px",
                              border: "1px solid #11395c",
                              backgroundColor: isSelected
                                ? "#11395c"
                                : "#ffffff",
                              color: isSelected ? "#ffffff" : "#11395c",
                            }}
                            onClick={() => setSelectedZone(zone)}
                          >
                            {zone.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </Row>
              )}
              {/* <Col xl={3} lg={4} md={5} sm={6} xs={12} className="mb-3"> */}
              <Col xl={4} lg={5} md={6} sm={8} xs={12} className="mb-3">
                <Label className="form-label text-muted label-font">
                  Client Code / Name / BOID
                </Label>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Enter Client Code or Name or BOID"
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Col>
            </Row>

            <DataTable selectedWidget={selectedCapsule} T6Data={filteredData} />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Index;
