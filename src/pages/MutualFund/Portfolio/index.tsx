import {
  Box,
  Card,
  Checkbox,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MutualFundTable from "../../../components/common/MutualFunds/MfTable";
// import { mutualFundRows } from "../../../helper/commmon";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import StatBoxComponent from "../../../components/common/MfStatBox";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { BankDetail, PortfolioRecord, PortfolioSummary } from "../mfTypes";
import { capitalizeEachWord } from "../../../utils";
// import ShowToast from "../../../utils/toastUtils";

const MfPortfolio = ({ onSelectFund, hasToken }: any) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioRecord[]>([]);
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioSummary | null>(null);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [confirmation, SetConfirmation] = useState(false);
  const [confirmationMessage, SetConfirmationMessage] = useState(false);
  const [message, SetMessage] = useState("");
  // const [banks, setBanks] = useState<BankDetail[]>([]);
  const [selectedRow, setSelectedRow] = useState<PortfolioRecord | null>(null);
  const [selectedBank, setSelectedBank] = useState<BankDetail | null>(null);
  const [clientCode, setClientCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [bseSchemeCode, setBseSchemeCode] = useState<any>("");

  const [redeemUnits, setRedeemUnits] = useState<number | string>(
    selectedRow?.balanceQuantity || ""
  );
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
        asOnDateTime: "2026-08-08",
        fromDateTime: "2000-01-01",
        toDateTime: "2026-09-01",
        asOnDate: "2026-09-01",
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

  useEffect(() => {
    if (selectedRow) {
      setRedeemUnits(selectedRow.balanceQuantity);
    }
  }, [selectedRow]);

  const handleRedeemClick = (row: PortfolioRecord) => {
    setSelectedRow(row);
    setRedeemModalOpen(true);
    clientBankDetails();
  };

  const handleModalToggle = () => {
    setRedeemModalOpen((prev) => !prev);
    setSelectedRow(null);
    SetConfirmation(false);
    SetConfirmationMessage(false);
    SetMessage("");
  };

  const clientBankDetails = async () => {
    dispatch(showLoader("Please wait we are processing your request"));

    try {
      const response = await apiServices.ClientProfile();
      const clientData = response?.data?.data;
      console.log(clientData, "Client Info");
      setClientCode(clientData?.clientCode || "");
      setMobile(clientData?.mobileNo || "");
      setEmail(clientData?.email || "");

      const rawData = clientData?.bankDetails ?? [];
      const formattedData: BankDetail[] = rawData.map(
        (item: any, index: number) => ({
          id: index + 1,
          name: item.bankName,
          account: item.bankAccountNumber,
          ifsc: item.ifsc,
          code: item.bankCode,
          paymentMode: item.payMode,
        })
      );
      // setBanks(formattedData);

      // Select the first bank if available
      if (formattedData.length > 0) {
        setSelectedBank(formattedData[0]);
      } else {
        setSelectedBank(null);
      }
    } catch (error) {
      console.error("Error fetching bank details:", error);
      setSelectedBank(null);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("Please wait, we are processing your request..."));

      try {
        const schemeRes = await apiServices.MF_FundOverView({
          pageNumber: 1,
          pageSize: 1,
          searchKey: "",
          schemeCode: selectedRow?.reedosCode,
          sipMinimum: "",
          lumpsumMinimum: "",
          riskCategory: "",
          assetClass: "",
          schemeCategory: "",
          encryptionKey: "",
        });

        const schemeData = schemeRes?.data?.data;

        console.log("Fund overview:", schemeData);

        // Example of setting state
        setBseSchemeCode(schemeData?.[0]?.bseSchemeCode ?? "");
      } catch (err: any) {
        console.error("Error fetching fund overview:", err.message);
      } finally {
        dispatch(hideLoader());
      }
    };

    if (confirmation) {
      fetchData();
    }
  }, [confirmation, dispatch, selectedRow]);

  const redeemApiCall = async () => {
    if (!selectedRow) return;
    console.log(
      selectedRow.physicalQuantity > 0 ? "P" : "C",
      "Confirmed!",
      bseSchemeCode
    );

    const payload = {
      transCode: "NEW",
      orderId: "",
      clientCode: clientCode,
      schemeCd: bseSchemeCode,
      buySell: "R",
      buySellType: "FRESH",
      orderVal: "",
      qty: redeemUnits.toLocaleString(),
      allRedeem: "N",
      folioNo: "",
      remarks: "test",
      dpc: "Y",
      euinVal: "Y",
      kycStatus: "Y",
      refNo: "",
      subBrCode: "",
      minRedeem: "",
      dpTxn: selectedRow.physicalQuantity > 0 ? "P" : "C",
      ipAdd: "",
      mobileNo: mobile,
      emailID: email,
      mandateID: "",
      param1: "",
      param2: "",
      param3: selectedBank?.account,
      filler1: "",
      filler2: "",
      filler3: "",
      filler4: "",
      filler5: "",
      filler6: "",
    };

    dispatch(showLoader("Redeeming Order..."));

    try {
      const response = await apiServices.BSEStar_MfOrderEntry(payload);

      if (response?.status === 200) {
        const rawData = response?.data?.data;
        console.log("Order Entry Response:", rawData);
        // handleModalToggle();
        SetMessage(rawData);
        SetConfirmationMessage(true);
        SetConfirmation(false);
        // ShowToast("info","h")
      } else {
        throw new Error("Lumpsum order API failed");
      }
    } catch (err) {
      console.error("Error placing lumpsum order:", err);
      return null;
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleInvestMore = (row: PortfolioRecord) => {
    console.log("Invest More clicked for", row);
    if (onSelectFund) {
      onSelectFund(row.reedosCode.toString());
    }
  };

  const handleRedeemUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRow) return; // ✅ Guard clause
    let value = e.target.value;

    // Ensure only numeric values (allow decimals if needed)
    if (!isNaN(Number(value)) || value === "") {
      // Limit max to balanceQuantity
      if (Number(value) > selectedRow.balanceQuantity) {
        value = selectedRow.balanceQuantity.toString();
      }
      setRedeemUnits(value);
    }
  };

  const renderModalContent = () => {
    if (!selectedRow) {
      return (
        <ModalBody>
          <p>No data found.</p>
        </ModalBody>
      );
    }

    if (confirmationMessage) {
      return (
        <>
          <ModalBody sx={{ px: 4, py: 3 }}>
            <Box
              sx={{
                backgroundColor: "#f5f7fa",
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <Typography variant="body1" fontWeight={400} color="text.primary">
                {capitalizeEachWord(message)}
              </Typography>
            </Box>
          </ModalBody>

          <ModalFooter sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              onClick={handleModalToggle}
              style={{
                textTransform: "none",
                fontWeight: 500,

                backgroundColor: "#11395C",
                color: "#fff",
                boxShadow: "none",
                borderRadius: "8px",
              }}
            >
              Okay
            </Button>
          </ModalFooter>
        </>
      );
    }

    if (confirmation) {
      return (
        <>
          <Box
            sx={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, #f9fafb, #eef2ff)",
              p: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            {/* Icon Section */}
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(29,78,216,0.3))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <i
                className="ri-shield-check-line"
                style={{ fontSize: 28, color: "#2563eb" }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1e293b", mb: 3 }}
            >
              Confirm Your Redemption
            </Typography>

            {/* Detail Card */}
            <Box
              sx={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                p: 3,
                textAlign: "left",
                mb: 3,
              }}
            >
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Fund</Typography>
                  <Typography fontWeight={600}>
                    {selectedRow.reedosName}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Folio</Typography>
                  <Typography fontWeight={600}>
                    {selectedRow.folioNumber}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Units</Typography>
                  <Typography fontWeight={600}>{redeemUnits}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Bank Account</Typography>
                  <Typography fontWeight={600}>
                    {selectedBank
                      ? `${selectedBank.name} •••• ${selectedBank.account.slice(
                          -4
                        )}`
                      : "—"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                onClick={handleModalToggle}
                style={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={redeemApiCall}
                style={{
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  background: "#22c55e", // green gradient
                  border: "1px solid #22c55e",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(34,197,94,0.4)",
                }}
              >
                Confirm
              </Button>
            </Stack>
          </Box>
        </>
      );
    }

    return (
      <>
        <ModalHeader toggle={handleModalToggle}>
          <Box>
            <Typography fontWeight={600}>{selectedRow.reedosName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Equity&nbsp;&nbsp;Large Cap Fund
            </Typography>
          </Box>
        </ModalHeader>
        <ModalBody sx={{ p: "1.5rem" }}>
          <Box
            display="grid"
            gridTemplateColumns="repeat(4,1fr)"
            gap={2}
            mb={3}
            sx={{ textAlign: "center" }}
          >
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Folio Number
              </Typography>
              <Typography fontWeight={600}>
                {" "}
                {selectedRow.folioNumber}
              </Typography>
            </Box>
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Current NAV
              </Typography>
              <Typography fontWeight={600}> {selectedRow.ltp}</Typography>
            </Box>
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Available Units
              </Typography>
              <Typography fontWeight={600}>
                {" "}
                {selectedRow.balanceQuantity}
              </Typography>
            </Box>
            <Box>
              <Typography fontSize={12} color="text.secondary">
                Current Value
              </Typography>
              <Typography fontWeight={600}>
                {" "}
                {selectedRow.currentValue.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Box>

          {/* Bank / Amount */}
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mb={3}>
            <Box>
              <Typography fontSize={12} color="text.secondary" mb={1}>
                Units to redeem
              </Typography>
              <TextField
                // label="Units to Redeem"
                type="number"
                inputProps={{
                  min: 0,
                  max: selectedRow!.balanceQuantity,

                  step: "any", // optional, if decimal units allowed
                }}
                value={redeemUnits}
                onChange={handleRedeemUnitsChange}
                fullWidth
              />
              <Box mt={1} display="flex" alignItems="center">
                <Checkbox
                  checked={redeemUnits === selectedRow?.balanceQuantity}
                  onChange={(e) =>
                    setRedeemUnits(
                      e.target.checked ? selectedRow?.balanceQuantity ?? "" : ""
                    )
                  }
                  size="small"
                />
                <Typography variant="body2">Full Redemption</Typography>
              </Box>
            </Box>

            <Box>
              <Typography fontSize={12} color="text.secondary" mb={1}>
                Bank Account for Credit
              </Typography>
              {selectedBank ? (
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    {selectedBank.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    xxxxxxxxxx{selectedBank.account.slice(-4)}
                  </div>
                </div>
              ) : (
                <Typography color="error" fontSize={12}>
                  No bank details found.
                </Typography>
              )}
            </Box>
          </Box>

          {/* Notes */}
          <Box
            sx={{
              backgroundColor: "#f6f7fb",
              borderRadius: "8px",
              p: 2,
              fontSize: 13,
              color: "text.secondary",
              mb: 3,
            }}
          >
            <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
              <li>
                Redemption proceeds will be credited within 3–4 working days for
                normal redemption.
              </li>
              <li>Exit load (if any) and applicable taxes will be deducted.</li>
              <li>
                For ELSS funds, ensure 3 years have passed since investment.
              </li>
            </ul>
          </Box>

          <Button
            fullWidth
            style={{
              backgroundColor: "#11395C",
            }}
            onClick={() => SetConfirmation(true)}
          >
            Redeem Funds
          </Button>
        </ModalBody>{" "}
      </>
    );
  };

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
        </Stack>
      </Card>
      <Card sx={{ borderRadius: 4, p: 2 }}>
        <MutualFundTable
          rows={portfolioData}
          selectedLabel="MfPortfolio"
          onRedeemClick={handleRedeemClick}
          // onSelectFund={onSelectFund}
          onInvestMoreClick={handleInvestMore}
        />
      </Card>

      <Modal
        isOpen={redeemModalOpen}
        toggle={handleModalToggle}
        centered
        size="md"
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default MfPortfolio;
