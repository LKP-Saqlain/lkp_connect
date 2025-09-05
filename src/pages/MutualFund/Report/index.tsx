import { useEffect, useState } from "react";
import BasicTabs from "../../../components/common/MutualFunds/NavTabs";
import { Card } from "@mui/material";
import MutualFundTable from "../../../components/common/MutualFunds/MfTable";
import { mutualFundRows } from "../../../helper/commmon";
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

const MfReport = () => {
  const [reportTab, setReportTab] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string>(tabList[0].label);
  const [mandateData, setMandateData] = useState<[]>([]);

  const dispatch = useDispatch<AppDispatch>();

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
            const parsedData = JSON.parse(response?.data?.data);

            const filteredMandateRecords = parsedData?.MandateDetails?.map(
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
    if (selectedLabel === "Ongoing SIP") {
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
            console.log("response", response?.data?.data);
            const parsedData = JSON.parse(response?.data?.data);

            const filteredOngoinSIPRecords = parsedData?.MandateDetails?.map(
              (item: any, index: number) => ({
                id: index + 1, // unique row id
                ...item,
              })
            );
            setMandateData(filteredOngoinSIPRecords);
            console.log("onGoingSIPDetails:", filteredOngoinSIPRecords);
          }
        })
        .catch((error) => {
          console.log("Errror", error);
          dispatch(hideLoader());
        });
    }
  }, [dispatch, selectedLabel]);

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
        <MutualFundTable rows={mandateData} selectedLabel={selectedLabel} />
      </Card>
    </>
  );
};

export default MfReport;
