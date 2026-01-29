import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RootState, AppDispatch } from "../../redux/store";
import { apiServices } from "../../services";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import RefreshIcon from "@mui/icons-material/Refresh";

import DataTable from "../../components/common/UserInfoTable";
import {
  expiryContestCriteriaRows,
  expiryContestRewardRows,
} from "../../helper/commmon";
import { Button } from "@mui/material";

const Expiry = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    handleExpiryData();
    const intervalId = setInterval(() => {
      handleExpiryData();
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleExpiryData = () => {
    const payload = {
      user_id: user_id,
    };
    dispatch(showLoader("Fetching Client Code..."));
    apiServices
      .GetDealerExpiryDashBoardData(payload)
      .then((response: any) => {
        const rawData = response?.data?.data || {};
        const formattedData = rawData.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));
        console.log(formattedData, "expiry Response:", response);
        setData(formattedData);
      })
      .catch((error: any) => {
        console.error("PhysicalClientInfo Error:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <div className="page-content page-view">
      <div className="container-fluid">
        <Row className="row-font">
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
                  backgroundColor: "#fff",
                  padding: "0.6rem 1rem",
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0">Expiry Day Contest</h5>

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
                    onClick={handleExpiryData}
                  >
                    Refresh <RefreshIcon sx={{ fontSize: "1.1rem" }} />
                  </Button>
                </div>
              </CardHeader>

              <CardBody>
                {/* Contest Criteria & Rewards */}
                <h6 className="card-title mb-3">
                  Contest Criteria and Rewards
                </h6>

                <Row className="mb-4">
                  {/* Criteria Table */}
                  <Col lg={6} md={12}>
                    <DataTable
                      activeMenu={"expiryContestCriteria"}
                      T6Data={expiryContestCriteriaRows}
                      selectedWidget="Criteria and Rewards"
                      customHide={true}
                    />
                  </Col>

                  {/* Rewards Table */}
                  <Col lg={6} md={12}>
                    <DataTable
                      activeMenu={"expiryContestReward"}
                      T6Data={expiryContestRewardRows}
                      selectedWidget="Criteria and Rewards"
                      customHide={true}
                    />
                  </Col>
                </Row>

                {/* Today's Contest Progress */}
                <h6 className="card-title mb-3">Today’s Contest Progress</h6>

                <DataTable
                  activeMenu={"todaysContestProgress"}
                  T6Data={data}
                  selectedWidget="Criteria and Rewards"
                  customHide={true}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Expiry;
