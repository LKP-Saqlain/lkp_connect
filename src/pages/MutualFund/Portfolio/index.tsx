import { Card, Stack, Typography } from "@mui/material";
import MutualFundTable from "../../../components/common/MutualFunds/MfTable";
import { mutualFundRows } from "../../../helper/commmon";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

const MfPortfolio = () => {
  const investedAmount = 54435;
  const currentValue = 395345;
  const totalReturns = 367565;
  const oneDayReturns = 566;
  const xirr = 58.3;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let payload = {
      loginUserMasterID: 0,
      clientMasterID: 0,
      fromDate: "",
      toDate: "",
      assetClassID: 86,
      assetClassIDs: "",
      asOnDateTime: "2024-08-08",
      fromDateTime: "2000-01-01",
      toDateTime: "2025-09-01",
      asOnDate: "2025-09-01",
      reportID: 0,
      portfolioID: 1,
      withIndexation: false,
      type: "",
      isHtml: false,
      securityName: "",
      securityType: "",
      isin: "",
      panGroup: 0,
      foliowise: true,
      arnFilter: "",
      sumid: "",
      configAssetClassID: 0,
      configTableID: "3,9,10,11",
      reportName: "",
      configPageID: 0,
      displayAsOnDate: true,
      displayFromDate: false,
      displayToDate: false,
    };

    dispatch(showLoader(""));
    apiServices
      .MF_PortfolioStatementReport(payload)
      .then((res) => {
        if (res?.status === 200) {
          dispatch(hideLoader());
          console.log("testt", res?.data);
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      });
  }, [dispatch]);

  return (
    <>
      <Card sx={{ borderRadius: 4, p: 2, mb: 3 }}>
        <Stack
          direction="row"
          spacing={5}
          justifyContent="space-around"
          alignItems="center"
        >
          <div>
            <Typography variant="body2" color="text.secondary">
              Invested Amount
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {investedAmount.toLocaleString()}
            </Typography>
          </div>

          <div>
            <Typography variant="body2" color="text.secondary">
              Current Value
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {currentValue.toLocaleString()}
            </Typography>
          </div>

          <div>
            <Typography variant="body2" color="text.secondary">
              Total Returns
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              color={totalReturns >= 0 ? "green" : "red"}
            >
              {totalReturns.toLocaleString()}
            </Typography>
          </div>

          <div>
            <Typography variant="body2" color="text.secondary">
              1D Returns
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              color={oneDayReturns >= 0 ? "green" : "red"}
            >
              {oneDayReturns.toLocaleString()}
            </Typography>
          </div>

          <div>
            <Typography variant="body2" color="text.secondary">
              XIRR
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {xirr}%
            </Typography>
          </div>

          {/* <Button
            variant="outlined"
            sx={{ textTransform: "none", fontWeight: 500, borderRadius: 2 }}
          >
            Portfolio Analysis
          </Button> */}
        </Stack>
      </Card>
      <Card sx={{ borderRadius: 4, p: 2 }}>
        <MutualFundTable rows={mutualFundRows} selectedLabel="MfPortfolio" />
      </Card>
    </>
  );
};

export default MfPortfolio;
