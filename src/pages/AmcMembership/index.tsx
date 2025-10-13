import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import {
  useDispatch,
  // useSelector
} from "react-redux";
import {
  AppDispatch,
  // RootState
} from "../../redux/store";

import UserCapsules from "../ClientDetails/UserCapsules";

const Index = ({ activeMenu }: any) => {
  //   const [data, setData] = useState<any>();
  //   const [flag, setFlag] = useState<boolean>(false);
  //   const [boId, setBoId] = useState("");
  const [selectedCapsule, setSelectedCapsule] = useState("Lifetime Membership");
  const [lifetimeData, setLifetimeData] = useState<any[]>([]);
  const [nonLifetimeData, setNonLifetimeData] = useState<any[]>([]);

  //   const [filteredData, setFilteredData] = useState([]);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const payload = {
      zone: "ALL",
      branchCode: "ALL",
      tradingCode: "ALL",
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
  }, []);
  const tableData =
    selectedCapsule === "Lifetime Membership" ? lifetimeData : nonLifetimeData;

  const handleClick = (value: string) => {
    console.log("You clicked the Chip.", value);
    setSelectedCapsule(value);
  };

  return (
    <div className="page-content page-view">
      <UserCapsules
        selectedCapsule={selectedCapsule}
        capsuleType="AMC Membership"
        handleClick={handleClick}
      />
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
            <DataTable
              activeMenu={activeMenu}
              T6Data={tableData}
              // handleDownload={handleClick}
              // showSearch={Array.isArray(data) && data.length > 0}
              // handleSearchBasedOnInput={handleSearchBasedOnInput}
              // searchValue={searchQuery}
              // T6Data={searchQuery ? filteredData : data}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Index;
