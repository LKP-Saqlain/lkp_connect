import { Card } from "reactstrap";
import FundDetails from "../FundDetails";
import MfAreaChart from "../MfAreaChart";
import MutualFundModal from "../MfModal";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";

const MfOverview = ({ schemeCode, onBack }: any) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [modalType, setModalType] = useState<"oneTime" | "sip" | null>(null);
  const [bseSchemeCode, setBseSchemeCode] = useState<any>("");

  const dispatch = useDispatch<AppDispatch>();
  const toggle = () => setOpen(!open);

  const [chartSeries, setChartSeries] = useState<
    { name: string; data: [number, number][] }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("Please wait, we are processing your request..."));

      try {
        // run both in parallel
        const [schemeRes, bseRes] = await Promise.all([
          apiServices.MF_SchemeDetails({ schemeCode }),
          apiServices.MF_FundOverView({
            pageNumber: 1,
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
        setBseSchemeCode(bseRes?.data?.data[0]?.bseSchemeCode ?? "");
      } catch (err: any) {
        console.error("Error->", err.message);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchData();
  }, [dispatch, schemeCode]);

  return (
    <>
      {/* Modal */}
      <MutualFundModal
        isOpen={open}
        toggle={toggle}
        modalType={modalType}
        title={data?.schemeName ?? ""}
        bseSchemeCode={bseSchemeCode}
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
              {/* <h4
              style={{
                margin: 0,
                fontWeight: 600,
                color: "#333",
                maxWidth: "70%",
              }}
            >
              {`Overview of ${data?.schemeName || ""}`}
            </h4> */}
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

                <h4
                  style={{
                    margin: 0,
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
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
                    setOpen(true);
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
                    setOpen(true);
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
              height={400}
            />
          )}
        </div>
      </Card>

      {/* Fund Details */}
      {data && <FundDetails data={data} />}
    </>
  );
};

export default MfOverview;
