import { Card, Stack } from "@mui/material";
import MutualFundTable from "../../../components/common/MutualFunds/MfTable";
// import { mutualFundRows } from "../../../helper/commmon";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import StatBoxComponent from "../../../components/common/MfStatBox";

interface PortfolioRecord {
  id: number;
  userMasterID: number;
  reedosName: string;
  accountId: number;
  folioNumber: string;
  assetClassId: number;
  balanceQuantity: number;
  investedAmount: number;
  currentValue: number;
  unrealizedProfitLoss: number;
  totalGain: number;
  weightage: number;
  absRet: number;
  noOfDays: number;
  ltp: number;
  avgPrice: number;
  xirr: string | null;
  totalXIRR: string | null;
  // add any other fields you need
}

interface PortfolioSummary {
  instrumentType: string;
  instrumentTypeId: number;
  sequenceId: number;
  investmentTypeID: number;
  investedAmount: number;
  currentValue: number;
  dividendReinvested: number;
  dividendPaid: number;
  unrealizedProfitLoss: number;
  totalGain: number;
  weightage: number;
  absRet: number;
  avgDays: number;
  interestAmount: number;
  maturityValue: number;
  colorCode: string;
  masterTableID: number;
  xirr: string;
  totalXIRR: string;
}

const MfPortfolio = ({ hasToken }: any) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioRecord[]>([]);
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioSummary | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchPortfolioData = async () => {
      dispatch(showLoader("Please wait!!..."));

      const payload = {
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

      try {
        const res = await apiServices.MF_PortfolioStatementReport(payload);

        if (res?.status === 200) {
          const records =
            res?.data?.data?.dataBucket?.r3?.map(
              (item: any, index: number) => ({
                id: index + 1,
                ...item,
              })
            ) || [];

          const r1 = res?.data?.data?.dataBucket?.r1?.[0] || null; // ✅ take first r1 record
          setPortfolioSummary(r1);
          setPortfolioData(records);
        }
      } catch (error) {
        console.error("ERROR", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    if (hasToken) {
      fetchPortfolioData();
    }
  }, [dispatch, hasToken]);

  return (
    <>
      <Card sx={{ borderRadius: 4, p: 2, mb: 3 }}>
        <Stack
          direction="row"
          spacing={5}
          justifyContent="space-around"
          alignItems="center"
        >
          {portfolioSummary && (
            <>
              <StatBoxComponent
                label="Invested Amount"
                value={portfolioSummary.investedAmount}
                isCurrency
              />
              <StatBoxComponent
                label="Current Value"
                value={portfolioSummary.currentValue}
                isCurrency
              />
              <StatBoxComponent
                label="Total Returns"
                value={portfolioSummary.totalGain}
                isCurrency
                color={portfolioSummary.totalGain >= 0 ? "green" : "red"}
              />
              <StatBoxComponent
                label="XIRR"
                value={parseFloat(portfolioSummary.xirr)}
                isPercentage
              />
            </>
          )}
          {/* <div>
            <Typography variant="body2" color="text.secondary">
              Current Value
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {currentValue.toLocaleString()}
            </Typography>
          </div> */}
          {/* <Button
            variant="outlined"
            sx={{ textTransform: "none", fontWeight: 500, borderRadius: 2 }}
          >
            Portfolio Analysis
          </Button> */}
        </Stack>
      </Card>
      <Card sx={{ borderRadius: 4, p: 2 }}>
        <MutualFundTable rows={portfolioData} selectedLabel="MfPortfolio" />
      </Card>
    </>
  );
};

export default MfPortfolio;
