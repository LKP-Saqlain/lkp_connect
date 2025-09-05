import { useEffect, useState } from "react";
import BasicTabs from "../../../components/common/MutualFunds/NavTabs";
import { Card } from "@mui/material";
import MutualFundTable from "../../../components/common/MutualFunds/MfTable";
// import { mutualFundRows } from "../../../helper/commmon";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { AppDispatch } from "../../../redux/store";

const tabList = [
  { label: "Mandates" },
  { label: "Upcoming SIP" },
  { label: "Ongoing SIP" },
  { label: "Transaction" },
];

interface upComingSIP {
  id: number;
  userMasterID: number;
  reedosName: string;
  accountId: number;
  sipRegsNo: string;
  startDate: string;
  endDate: string;
  amount: number;
  investedAmount: number;
  currentValue: number;
  unrealizedProfitLoss: number;
  totalGain: number;
  xirr: string | null;
  totalXIRR: string | null;
  // ... add other fields if needed
}

interface TransactionRecord {
  assetClassId: number;
  folioNumber: string;
  security: string;
  isin: string;
  transactionDate: string;
  action: string;
  quantity: number;
  transactionPrice: number;
  netPrice: number;
  brokerage: number;
  amount: number;
  tranId: number;
  accountID: number;
  cumulativeQuantity: number;
  // add more fields as per your response if required
}

const MfReport = () => {
  const [reportTab, setReportTab] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string>(tabList[0].label);
  const [mandateData, setMandateData] = useState<[]>([]);
  const [allSIPs, setAllSIPs] = useState<upComingSIP[]>([]);
  const [filteredSIPs, setFilteredSIPs] = useState<upComingSIP[]>([]);
  const [ongoingSIP, setOngoingSIP] = useState<upComingSIP[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  // const { user_id } = useSelector(
  //   (state: RootState) => state.UserLogin?.data?.data
  // );

  useEffect(() => {
    if (selectedLabel === "Mandates") {
      const payload = {
        clientCodeField: "MT0600508",
        fromDateField: "01/01/2000",
        mandateIdField: "",
        toDateField: "01/09/2025",
      };
      dispatch(showLoader(""));
      apiServices
        .BSEStar_MfMandateStatus(payload)
        .then((response) => {
          if (response?.status === 200) {
            dispatch(hideLoader());

            console.log("response", response?.data?.data);
            // const parsedData = JSON.parse(response?.data?.data);
            // console.log("parseData", parsedData);

            const filteredMandateRecords =
              response?.data?.data?.mandateDetails?.map(
                (item: any, index: number) => ({
                  id: index + 1, // unique row id
                  ...item,
                })
              );
            setMandateData(filteredMandateRecords);

            console.log("MandateDetails:", filteredMandateRecords);
          }
        })
        .catch((error) => {
          console.log("Errror", error);
          dispatch(hideLoader());
        });
    }
  }, [dispatch, selectedLabel]);

  useEffect(() => {
    if (selectedLabel === "Ongoing SIP" || selectedLabel === "Upcoming SIP") {
      const payload = {
        loginUserMasterID: 0,
        clientMasterID: 0,
        fromDate: null,
        toDate: null,
        assetClassID: 86,
        assetClassIDs: null,
        asOnDateTime: "2024-02-15T17:41:00.673+05:30",
        fromDateTime: "2023-02-15T17:41:00.674+05:30",
        toDateTime: "2024-02-15T17:41:00.673+05:30",
        asOnDate: "2024-02-15",
        reportID: 0,
        portfolioID: 1,
        withIndexation: false,
        type: null,
        isHtml: false,
        securityName: null,
        securityType: null,
        isin: null,
        panGroup: 0,
        foliowise: true,
        arnFilter: "",
        sumid: null,
        scheme: null,
        folioNo: null,
        configAssetClassID: 0,
        configTableID: "3,9,10,11",
        reportName: null,
        configPageID: 0,
        displayAsOnDate: true,
        displayFromDate: false,
        displayToDate: false,
        displayFolioWise: true,
      };
      dispatch(showLoader(""));
      apiServices
        .MF_OngoingSIP(payload)
        .then((response) => {
          if (response?.status === 200) {
            dispatch(hideLoader());
            console.log("response", response?.data);

            if (selectedLabel === "Upcoming SIP") {
              if (response.data?.isSuccess) {
                // ✅ Map to add unique `id`
                const sipRecords: upComingSIP[] =
                  response.data.data.dataBucket.r0.map(
                    (item: any, index: number) => ({
                      id: index + 1,
                      ...item,
                    })
                  );

                // ✅ Filter based on endDate (only future SIPs)
                const today = new Date();
                const filtered = sipRecords.filter((record) => {
                  if (!record.endDate) return false;
                  const end = new Date(record.endDate);
                  return end > today;
                });

                setAllSIPs(sipRecords);
                console.log(allSIPs);
                setFilteredSIPs(filtered);
                console.log("FilteredRecords", filtered);
              }
            }
            if (selectedLabel === "Ongoing SIP") {
              const onGoingSIPRecords: upComingSIP[] =
                response.data.data.dataBucket.r0.map(
                  (item: any, index: number) => ({
                    id: index + 1,
                    ...item,
                  })
                );
              setOngoingSIP(onGoingSIPRecords);
            }
          }
        })
        .catch((error) => {
          console.log("Errror", error);
          dispatch(hideLoader());
        });
    }
  }, [dispatch, selectedLabel]);

  useEffect(() => {
    if (selectedLabel === "Transaction") {
      let payload = {
        loginUserMasterID: 0,
        clientMasterID: 0,
        fromDate: "2020-02-07",
        toDate: "2024-02-07",
        assetClassID: 86,
        assetClassIDs: null,
        asOnDateTime: "2024-02-07T10:54:05.584+05:30",
        fromDateTime: "2020-02-07T00:00:00",
        toDateTime: "2024-02-07T10:54:05.584+05:30",
        asOnDate: null,
        reportID: 0,
        portfolioID: 1,
        withIndexation: false,
        type: null,
        isHtml: false,
        securityName: null,
        securityType: null,
        isin: null,
        panGroup: 0,
        foliowise: true,
        arnFilter: null,
        sumid: "",
        configAssetClassID: 0,
        configTableID: null,
        reportName: null,
        configPageID: 0,
        displayAsOnDate: false,
        displayFromDate: true,
        displayToDate: true,
      };
      dispatch(showLoader(""));
      apiServices
        .MF_TransactionReport(payload)
        .then((response) => {
          console.log("Response", response);
          dispatch(hideLoader());

          // ✅ Assuming response.data contains array of transactions
          if (response?.data?.isSuccess) {
            const records: TransactionRecord[] =
              response.data.data?.map((item: any, index: number) => ({
                id: index + 1, // unique id
                ...item,
              })) || [];

            setTransactions(records);
          }

          dispatch(hideLoader());
        })
        .catch((error) => {
          console.log("Errror", error);
          dispatch(hideLoader());
        });
    }
  }, [selectedLabel, dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setReportTab(newValue);
    const label = tabList[newValue]?.label;
    setSelectedLabel(label);
    console.log("Selected Tab Index:", newValue);
    console.log("Selected Tab Label:", label);
  };

  return (
    <>
      <Card sx={{ borderRadius: 4, p: 2, mb: 3 }}>
        <BasicTabs
          heading="Report"
          tabs={tabList}
          value={reportTab}
          onChange={handleTabChange}
        />
      </Card>
      <Card sx={{ borderRadius: 4, p: 2 }}>
        <MutualFundTable
          rows={
            selectedLabel === "Mandates"
              ? mandateData
              : selectedLabel === "Upcoming SIP"
              ? filteredSIPs
              : selectedLabel === "Ongoing SIP"
              ? ongoingSIP
              : selectedLabel === "Transaction"
              ? transactions
              : []
          }
          selectedLabel={selectedLabel}
        />
      </Card>
    </>
  );
};

export default MfReport;
