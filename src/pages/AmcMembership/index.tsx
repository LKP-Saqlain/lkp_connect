import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import UserCapsules from "../ClientDetails/UserCapsules";
import ComDropDown from "../../components/common/Dropdown/commonDropdown";
import DashboardCard from "../../components/common/DashboardCard";

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
  const [selectedBranch, setSelectedBranch] = useState<DropdownOption | null>(
    null
  );

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  // ... inside your component:

  const fetchData = () => {
    const payload = {
      zone: selectedZone?.value || "ALL",
      branchCode: selectedBranch?.value || "ALL",
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

        const formattedWithLifetime = withLifetime.map(
          (item: any, index: number) => ({
            id: index + 1,
            ...item,
          })
        );

        const formattedWithoutLifetime = withoutLifetime.map(
          (item: any, index: number) => ({
            id: index + 1,
            ...item,
          })
        );

        setLifetimeData(formattedWithLifetime);
        setNonLifetimeData(formattedWithoutLifetime);
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
      branchcode: selectedBranch?.value || "ALL",
      tradingCode: "ALL",
      user_id: user_id,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetClientDPContest(payload)
      .then((response) => {
        const resData = response?.data?.data?.clientModule;
        const countDetails =
          response?.data?.data?.dpClientcountdetails?.[0] || {};
        const formattedData = resData.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));
        console.log(formattedData, "resDatafrom GetClientDPContest");
        SetContestData(formattedData);
        setClientCount(countDetails.traded_Client_Count || 0);
        setIncentiveEarned(countDetails.incentiveEran || 0);
      })
      .catch((error) => {
        console.error("Error fetching compliance data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    if (selectedCapsule === "Contest Earned") {
      fetchContestData();
    } else {
      fetchData();
    }
  }, [selectedZone, selectedBranch, selectedCapsule]);

  const tableData =
    selectedCapsule === "Lifetime Membership"
      ? lifetimeData
      : selectedCapsule === "Non-Lifetime Membership"
      ? nonLifetimeData
      : contestData;

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
              title="Incentitive Earned"
              value={incentiveEarned}
              customClass={true}
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
              position: "relative", // for absolute positioning inside
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h4
              className="card-title mb-0"
              style={{
                width: "100%",
                textAlign: "center",
                margin: 0,
              }}
            >
              AMC {selectedCapsule}
            </h4>
          </CardHeader>

          <CardBody>
            {accessType === "ALL" && selectedCapsule != "Contest Earned" && (
              <ComDropDown
                onSelectionChange={(zone: any, branch: any) => {
                  setSelectedZone(zone);
                  setSelectedBranch(branch);
                }}
              />
            )}

            <DataTable
              selectedWidget={selectedCapsule}
              T6Data={tableData}
              // handleDownload={handleClick}
              //   showSearch={Array.isArray(tableData) && tableData.length > 0}
              // handleSearchBasedOnInput={handleSearchBasedOnInput}
              // searchValue={searchQuery}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Index;
