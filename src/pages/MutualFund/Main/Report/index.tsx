import { useEffect, useState } from "react";
import BasicTabs from "../../../../components/common/MutualFunds/NavTabs";
import { Card, Typography } from "@mui/material";
import MutualFundTable from "../../../../components/common/MutualFunds/MfTable";
import { apiServices } from "../../../../services";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { AppDispatch } from "../../../../redux/store";
import TradeCard from "../../../../components/common/tradeCard";
import { tabList, TransactionRecord, upComingSIP } from "../../mfTypes";

const MfReport = (props: any) => {
  const [reportTab, setReportTab] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState<string>(tabList[0].label);
  const [mandateData, setMandateData] = useState<TransactionRecord[]>([]);
  // const [allSIPs, setAllSIPs] = useState<upComingSIP[]>([]);
  const [filteredSIPs, setFilteredSIPs] = useState<upComingSIP[]>([]);
  const [ongoingSIP, setOngoingSIP] = useState<upComingSIP[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const date = new Date();
  const todaysDate =
    String(date.getDate()).padStart(2, "0") +
    "/" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "/" +
    date.getFullYear();

  useEffect(() => {
    const { clientCode } = props;
    if (selectedLabel === "Mandates") {
      const payload = {
        clientCodeField: clientCode, // "MT0600508"
        fromDateField: "01/01/2000",
        mandateIdField: "",
        toDateField: todaysDate,
      };
      dispatch(showLoader(""));
      apiServices
        .BSEStar_MfMandateStatus(payload)
        .then((response) => {
          if (response?.status === 200) {
            dispatch(hideLoader());

            console.log("responseMandate", response?.data?.data);
            // const parsedData = JSON.parse(response?.data?.data);
            // console.log("parseData", parsedData);

            const filteredMandateRecords = response?.data?.data?.map(
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
  }, [dispatch, selectedLabel, props.hasToken]);

  const parseSipDate = (dateStr: string) => {
    const [day, mon, year] = dateStr.split("-");
    return new Date(`${mon} ${day}, ${year}`);
  };
  const today = new Date();

  const asOnDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  console.log(asOnDate); // e.g., "2025-12-05"

  const getNextSipDate = (startDateStr: string): Date => {
    const sipDate = parseSipDate(startDateStr);
    const sipDay = sipDate.getDate();

    const today = new Date();

    const next = new Date();
    next.setHours(0, 0, 0, 0);

    // If SIP day is still upcoming this month
    if (sipDay >= today.getDate()) {
      next.setDate(sipDay);
    } else {
      // next month SIP date
      next.setMonth(next.getMonth() + 1);
      next.setDate(sipDay);
    }

    return next;
  };

  const getDaysRemaining = (date: Date): number => {
    const today = new Date().setHours(0, 0, 0, 0);
    const target = date.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  // ************ MAIN USEEFFECT ************
  useEffect(() => {
    if (selectedLabel === "Ongoing SIP" || selectedLabel === "Upcoming SIP") {
      const payload = {
        loginUserMasterID: 0,
        clientMasterID: 0,
        fromDate: null,
        toDate: null,
        assetClassID: 86,
        assetClassIDs: null,
        asOnDateTime: "2026-02-05T17:41:00.673+05:30",
        fromDateTime: "2021-02-15T17:41:00.674+05:30",
        toDateTime: "2026-09-01T17:41:00.673+05:30",
        asOnDate: asOnDate,
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
            let allSipData = response.data.data.dataBucket.r0.map(
              (item: any, index: number) => {
                const nextSip = getNextSipDate(item.startDate);
                const daysRemaining = getDaysRemaining(new Date(nextSip));

                return {
                  id: index + 1,
                  ...item,
                  nextSipDate: nextSip,
                  daysRemaining: daysRemaining, // <-- Added here
                };
              }
            );

            // setAllSIPs(allSipData);

            // ********** UPCOMING SIP LOGIC **********
            if (selectedLabel === "Upcoming SIP") {
              const today = new Date();
              const next15 = new Date();
              next15.setDate(today.getDate() + 15);

              const upcomingSIPs = allSipData.filter((sip: any) => {
                const nextInstallment = sip.nextSipDate;
                return nextInstallment >= today && nextInstallment <= next15;
              });

              // sort ascending by upcoming date
              upcomingSIPs.sort(
                (a: any, b: any) =>
                  a.nextSipDate.getTime() - b.nextSipDate.getTime()
              );

              console.log("Upcoming SIPs:", upcomingSIPs);
              setFilteredSIPs(upcomingSIPs);
            }

            // ********** ONGOING SIP **********
            if (selectedLabel === "Ongoing SIP") {
              const sorted = [...allSipData].sort((a, b) => {
                const da = new Date(a.initialInvestment);
                const db = new Date(b.initialInvestment);
                return db.getTime() - da.getTime(); // DESCENDING
              });

              setOngoingSIP(sorted);
            }
          }
        })
        .catch((error) => {
          console.log("Errror", error);
          dispatch(hideLoader());
        });
    }
  }, [dispatch, selectedLabel, props.hasToken]);

  const transTodaysDate =
    String(date.getDate()).padStart(2, "0") +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    date.getFullYear();
  useEffect(() => {
    if (selectedLabel === "Transaction") {
      let payload = {
        loginUserMasterID: 0,
        clientMasterID: 0,
        fromDate: "2024-12-17",
        toDate: transTodaysDate,
        assetClassID: 86,
        assetClassIDs: null,
        asOnDateTime: "2026-89-07T10:54:05.584+05:30",
        fromDateTime: "2024-02-07T00:00:00",
        toDateTime: "2026-09-02T10:54:05.584+05:30",
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
          if (response?.data?.isSuccess) {
            const records: TransactionRecord[] =
              response.data.data?.item1?.map((item: any, index: number) => ({
                id: index + 1, // unique id
                ...item,
              })) || [];

            records.sort(
              (a, b) =>
                new Date(b.transactionDate).getTime() -
                new Date(a.transactionDate).getTime()
            );

            setTransactions(records);
          }

          dispatch(hideLoader());
        })
        .catch((error) => {
          console.log("Errror", error);
          dispatch(hideLoader());
        });
    }
  }, [selectedLabel, dispatch, props.hasToken]);

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
        {selectedLabel === "Mandates" ? (
          mandateData?.length > 0 ? (
            mandateData.map((item, index) => (
              <TradeCard
                key={index}
                type="Mandate"
                clientName={item.clientName}
                status={item.status}
                bankName={item.bankName}
                bankAccNumber={item.bankAccNo}
                mandateId={item.mandateId}
                regnDate={item.regnDate}
                amount={item.amount}
              />
            ))
          ) : (
            <Typography>No mandates found</Typography>
          )
        ) : (
          <MutualFundTable
            rows={
              selectedLabel === "Upcoming SIP"
                ? filteredSIPs
                : selectedLabel === "Ongoing SIP"
                ? ongoingSIP
                : selectedLabel === "Transaction"
                ? transactions
                : []
            }
            selectedLabel={selectedLabel}
          />
        )}
      </Card>
    </>
  );
};

export default MfReport;
