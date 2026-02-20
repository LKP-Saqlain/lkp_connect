import { Card } from "reactstrap";
import FundDetails from "../FundDetails";
import MfAreaChart from "../MfAreaChart";
import MutualFundModal from "../MfModal";
import TypeMFModal from "../MfModal/TypeMF";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";

const MfOverview = ({
  schemeCode,
  onBack,
  hasToken,
  onOrderSuccess,
  ClientCode,
  onPhysicalOnboard,
  investMoreDetails,
  handleTradingOpen,
}: any) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [modalType, setModalType] = useState<"oneTime" | "sip" | null>(null);
  const [bseSchemeCode, setBseSchemeCode] = useState<any>("");
  const [redeemFolioNumber, setRedeemFolioNumber] = useState<any>("");
  const [fundOverviewData, setFundOverviewData] = useState<any>(null);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [selectedMfType, setSelectedMfType] = useState<
    "physical" | "demat" | ""
  >("");

  const dispatch = useDispatch<AppDispatch>();
  const toggle = () => setOpen(!open);

  const [chartSeries, setChartSeries] = useState<
    { name: string; data: [number, number][] }[]
  >([]);

  useEffect(() => {
    if (!investMoreDetails) {
      setSelectedMfType(""); // reset type if no investMoreDetails
      return;
    }
    const redeemSelectedMfType =
      investMoreDetails.physicalQuantity > 0 ? "physical" : "demat";
    setSelectedMfType(redeemSelectedMfType);
    setRedeemFolioNumber(investMoreDetails.folioNumber);
    console.log(
      investMoreDetails.folioNumber,
      "<----folioNumber selectedMfType--->",
      redeemSelectedMfType
    );
  }, [investMoreDetails]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("Please wait, we are processing your request..."));

      try {
        // run both in parallel
        const [schemeRes, bseRes] = await Promise.all([
          apiServices.MF_SchemeDetails({ schemeCode }),
          apiServices.MF_FundOverView({
            pageNumber: 0,
            pageSize: 1,
            searchKey: "",
            schemeCode,
            sipMinimum: "",
            lumpsumMinimum: "",
            riskCategory: "",
            assetClass: "",
            schemeCategory: "",
            encryptionKey: "",
          }),
        ]);

        // handle SchemeDetails response
        const fundOverviewData = schemeRes?.data?.data;
        setData(fundOverviewData);

        const historicalData = fundOverviewData?.historicalNAVDetails || [];
        setChartSeries([
          {
            name: fundOverviewData?.schemeName || "Fund Growth",
            data: historicalData.map((entry: any) => [
              new Date(entry.navDate).getTime(),
              Number(entry.nav),
            ]),
          },
        ]);

        // handle FundOverView response
        setFundOverviewData(bseRes?.data?.data[0]);
        setBseSchemeCode(bseRes?.data?.data[0]?.bseSchemeCode ?? "");
      } catch (err: any) {
        console.error("Error->", err.message);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchData();
  }, [dispatch, schemeCode, hasToken]);

  return (
    <>
      {/* Show TypeMFModal only if type is missing */}
      {!selectedMfType && isTypeModalOpen && (
        <TypeMFModal
          isOpen={isTypeModalOpen}
          toggle={() => setIsTypeModalOpen(!isTypeModalOpen)}
          selectedType={selectedMfType}
          onTypeSelect={(type) => {
            setSelectedMfType(type);
            setIsTypeModalOpen(false); // close Type modal
            setOpen(true); // NOW open main MF modal
          }}
          ClientCode={ClientCode}
          onPhysicalOnboard={onPhysicalOnboard}
          handleTradingOpen={handleTradingOpen}
        />
      )}

      {/* Modal */}
      <MutualFundModal
        isOpen={open}
        toggle={toggle}
        modalType={modalType}
        title={fundOverviewData ?? ""}
        bseSchemeCode={bseSchemeCode}
        selectedType={selectedMfType}
        hasToken={hasToken}
        onOrderSuccess={onOrderSuccess}
        onBack={onBack}
        redeemFolioNumber={redeemFolioNumber}
      />

      <Card>
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Back Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onBack}
              style={{
                backgroundColor: "#11395C",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ← Back
            </button>
          </div>

          {/* Heading + Action Buttons */}
          {data && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  maxWidth: "70%",
                }}
              >
                <img
                  src={data?.amcIcon}
                  alt={"AMC Logo"}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                  }}
                />
                <h4 style={{ margin: 0, fontWeight: 600, color: "#333" }}>
                  {data?.schemeName || ""}
                </h4>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                {/* One Time */}
                <button
                  style={{
                    backgroundColor: "#004AAD",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 18px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => {
                    setModalType("oneTime");
                    if (!selectedMfType) setIsTypeModalOpen(true);
                    // open type modal if type missing
                    else setOpen(true); // open MF modal if type exists
                  }}
                >
                  Lumpsum
                </button>

                {/* Start SIP */}
                <button
                  style={{
                    backgroundColor: "#004AAD",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 18px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => {
                    setModalType("sip");
                    if (!selectedMfType) setIsTypeModalOpen(true);
                    else setOpen(true);
                  }}
                >
                  Start SIP
                </button>
              </div>
            </div>
          )}

          {/* Chart */}
          {data && (
            <MfAreaChart
              series={chartSeries}
              defaultRange="one_year"
              height={280}
            />
          )}
        </div>
      </Card>

      {/* Fund Details */}
      {data && <FundDetails data={data} fundOverviewData={fundOverviewData} />}
    </>
  );
};

export default MfOverview;
