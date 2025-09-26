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

const MfPortfolio = ({ hasToken }: any) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioRecord[]>([]);
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioSummary | null>(null);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [confirmation, SetConfirmation] = useState(false);
  // const [banks, setBanks] = useState<BankDetail[]>([]);
  const [selectedRow, setSelectedRow] = useState<PortfolioRecord | null>(null);
  const [selectedBank, setSelectedBank] = useState<BankDetail | null>(null);
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
  };

  const clientBankDetails = async () => {
    dispatch(showLoader("Please wait we are processing your request"));

    try {
      const response = await apiServices.ClientProfile();
      const clientData = response?.data?.data;
      console.log(clientData, "count: %d");

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

  const redeemApiCall = async () => {
    console.log("Confirmed!");
    SetConfirmation(false);

    // const payload = {
    //   transCode: "NEW",
    //   orderId: "",
    //   clientCode: clientNo,
    //   schemeCd: bseSchemeCode,
    //   buySell: "P",
    //   buySellType: "FRESH",
    //   orderVal: amount,
    //   qty: "",
    //   allRedeem: "N",
    //   folioNo: "",
    //   remarks: "test",
    //   dpc: "Y",
    //   euinVal: "Y",
    //   kycStatus: "Y",
    //   refNo: "",
    //   subBrCode: "",
    //   minRedeem: "",
    //   dpTxn: "C",
    //   ipAdd: "",
    //   mobileNo: mobileNo,
    //   emailID: email,
    //   mandateID: "",
    //   param1: "",
    //   param2: "",
    //   param3: "",
    //   filler1: "",
    //   filler2: "",
    //   filler3: "",
    //   filler4: "",
    //   filler5: "",
    //   filler6: "",
    // };

    // dispatch(showLoader("Placing Lumpsum Order..."));

    // try {
    //   const response = await apiServices.BSEStar_MfOrderEntry(payload);

    //   if (response?.status === 200) {
    //     const rawData = response?.data?.data;
    //     console.log("Order Entry Response:", rawData);

    //     const orderNumber = extractOrderNumber(rawData);
    //     console.log("orderNo orderNumber is", orderNumber);

    //     if (response?.data?.statusCode === 417) {
    //       ShowToast("error", response?.data?.data);
    //       console.log("Order Entry Response:", rawData);
    //     }
    //     if (!orderNumber) {
    //       throw new Error("Could not extract order number from response");
    //     }
    //     return orderNumber;
    //   } else {
    //     throw new Error("Lumpsum order API failed");
    //   }
    // } catch (err) {
    //   console.error("Error placing lumpsum order:", err);
    //   return null;
    // } finally {
    //   dispatch(hideLoader());
    // }
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

    if (confirmation) {
      return (
        <>
          <ModalHeader toggle={handleModalToggle}>
            GTT Order Cancel Confirmation
          </ModalHeader>

          <ModalBody sx={{ p: "1.5rem" }}>
            <Box
              display="grid"
              gridTemplateColumns="100px 1fr"
              rowGap={2}
              columnGap={3}
              sx={{ fontSize: 14 }}
            >
              <Typography color="text.secondary">Fund</Typography>
              <Typography fontWeight={600}>{selectedRow.reedosName}</Typography>

              <Typography color="text.secondary">Folio</Typography>
              <Typography fontWeight={600}>
                {selectedRow.folioNumber}
              </Typography>

              <Typography color="text.secondary">Units</Typography>
              <Typography fontWeight={600}>{redeemUnits}</Typography>

              <Typography color="text.secondary">Bank Account</Typography>
              <Typography fontWeight={600}>
                {selectedBank
                  ? `${selectedBank.name} XXXX${selectedBank.account.slice(-4)}`
                  : "—"}
              </Typography>
            </Box>
          </ModalBody>

          <ModalFooter>
            {/* Cancel button */}
            <Button color="secondary" onClick={handleModalToggle}>
              Cancel
            </Button>

            {/* Confirm button */}
            <Button
              color="primary"
              onClick={() => {
                // put your confirm logic here
                redeemApiCall();
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
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
                label="Units to Redeem"
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
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#0b5ed7",
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
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

      {/*  <Modal
        isOpen={redeemModalOpen}
        toggle={handleModalToggle}
        centered
        size="md"
      >
        {confirmation ? (
          <>
            <ModalHeader>GTT Order Cancel Confirmation</ModalHeader>
            <ModalBody style={{ padding: "1.5rem" }}>
              <Box
                display="grid"
                gridTemplateColumns="100px 1fr"
                rowGap={2}
                columnGap={3}
                sx={{ fontSize: 14 }}
              >
                <Typography color="text.secondary">Fund</Typography>
                <Typography fontWeight={600}>
                  Axis HardCore confirmation Small Cap Fund R G
                </Typography>

                <Typography color="text.secondary">Folio</Typography>
                <Typography fontWeight={600}>910200439803</Typography>

                <Typography color="text.secondary">Units</Typography>
                <Typography fontWeight={600}>1.0240</Typography>

                <Typography color="text.secondary">Bank Account</Typography>
                <Typography fontWeight={600}>HDFC Bank XXXX6727</Typography>
              </Box>
            </ModalBody>
          </>
        ) : selectedRow ? (
          <>
            <ModalHeader toggle={handleModalToggle}>
              <Box display="flex" alignItems="center">
                <Box>
                  <Typography fontWeight={600}>
                    {selectedRow.reedosName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Equity&nbsp;&nbsp;Large Cap Fund
                  </Typography>
                </Box>
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

 
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={3} mb={3}>
                <Box>
                  <Typography fontSize={12} color="text.secondary" mb={1}>
                    Units to redeem
                  </Typography>
                  <TextField
                    label="Units to Redeem"
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
                          e.target.checked
                            ? selectedRow?.balanceQuantity ?? ""
                            : ""
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
                    Redemption proceeds will be credited within 3–4 working days
                    for normal redemption.
                  </li>
                  <li>
                    Exit load (if any) and applicable taxes will be deducted.
                  </li>
                  <li>
                    For ELSS funds, ensure 3 years have passed since investment.
                  </li>
                </ul>
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#0b5ed7",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.2,
                }}
                onClick={() => SetConfirmation(true)}
              >
                Redeem Funds
              </Button>
            </ModalBody>
          </>
        ) : (
          <ModalBody>
            <p>No data found.</p>
          </ModalBody>
        )}
        {confirmation && <ModalHeader>confirmation</ModalHeader>}
      </Modal> */}
    </>
  );
};

export default MfPortfolio;
