import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import UserInfoTable from "../../../components/common/UserInfoTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";

interface IVRSummaryData {
  offlineTrade: { Offline_TradeCount: number }[];
  onlineTrade: { Online_TradeCount: number }[];
  totalTrade: { Total_TradeCount: number }[];
  matchCount: { IVR_Match_OrderCount: number }[];
  mismatchCount: { IVR_Mismatch_OrderCount: number }[];
  segmentTrade: {
    Segment: string;
    TradeCount: number;
  }[];
}

interface SegmentTradeItem {
  Segment: string;
  TradeCount: number;
}

interface IVRDashboardProps {
  activeSubItem: string;
}

interface SummaryCardProps {
  title: string;
  value: number | null | undefined;
  onClick: (segment?: string) => void;
  segmentItems?: SegmentTradeItem[];
}

const SummaryCard = ({
  title,
  value,
  onClick,
  segmentItems,
}: SummaryCardProps) => {
  const displayValue = Number.isFinite(Number(value))
    ? Number(value).toLocaleString("en-IN")
    : "0";

  return (
    <Card
      style={{
        height: "50%",
        minHeight: "100px",
        borderRadius: "12px",
        border: "1px solid #E5EAF0",
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.06)",
        marginBottom: 0,
      }}
    >
      <CardBody
        style={{
          display: "flex",
          flexDirection: segmentItems ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: segmentItems ? "0px" : "12px",
          padding: "18px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#475467",
            flexShrink: 0,
            // border: "1px solid black",
          }}
        >
          {title}
        </span>

        {segmentItems ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              flex: 1,
              minWidth: 0,
            }}
          >
            {segmentItems.map((item, index) => (
              <React.Fragment key={item.Segment}>
                {index > 0 && (
                  <div
                    style={{
                      height: "30px",
                      borderLeft: "1px solid #E5EAF0",
                      margin: "0 8px",
                      flexShrink: 0,
                    }}
                  />
                )}

                <button
                  type="button"
                  onClick={() => onClick(item.Segment)}
                  aria-label={`View ${item.Segment} trade details`}
                  title={`${item.Segment}: ${item.TradeCount.toLocaleString("en-IN")}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                    border: "none",
                    background: "transparent",
                    padding: "2px",
                    color: "#11395C",
                    cursor: "pointer",
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#667085" }}>
                    {item.Segment}
                  </span>

                  <span style={{ fontSize: "16px", fontWeight: 700 }}>
                    {(item.TradeCount ?? 0).toLocaleString("en-IN")}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onClick()}
            aria-label={`View details for ${title}`}
            style={{
              border: "none",
              background: "transparent",
              padding: "4px",
              color: "#11395C",
              fontSize: "22px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {displayValue}
          </button>
        )}
      </CardBody>
    </Card>
  );
};

const sectionMap: Record<string, string> = {
  offlineTrade: "OfflineTrade",
  onlineTrade: "OnlineTrade",
  totalTrade: "TotalTrade",
  matchCount: "IVRMatched",
  mismatchCount: "IVRNotMatched",
  segmentTrade: "SegmentDetails",
};

const IVRDashboard = ({ activeSubItem }: IVRDashboardProps) => {
  const [summaryData, setSummaryData] = useState<IVRSummaryData | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [detailRows, setDetailRows] = useState<Record<string, unknown>[]>([]);
  const [tradeDate, setTradeDate] = useState<Dayjs | null>(dayjs());

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data ?? {},
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchIVRSummary = async () => {
      if (!user_id) return;

      const payload = {
        loginId: user_id, // Hardcoded for testing; replace with user_id in production
        tradeDate: tradeDate?.format("YYYY-MM-DD") ?? "",
        tradeNo: "",
      };
      dispatch(showLoader("Fetching IVR trade summary..."));

      try {
        const response = await apiServices.GetIVRTradeSummaryCount(payload);

        console.log("apiResponse", response?.data);

        if (
          response?.status === 200 &&
          response?.data?.statusCode === 200 &&
          response?.data?.isSuccess
        ) {
          setSummaryData(response.data.data);
          dispatch(hideLoader());
        } else {
          setSummaryData(null);
          ShowToast(
            "error",
            response?.data?.message || "Failed to fetch IVR summary",
          );
        }
      } catch (error) {
        console.error("GetIVRTradeSummaryCount error:", error);
        dispatch(hideLoader());
        setSummaryData(null);
        ShowToast("error", "Unable to fetch IVR trade summary");
      } finally {
        dispatch(hideLoader());
      }
    };

    void fetchIVRSummary();
  }, [user_id, tradeDate]);

  const handleSummaryClick = async (key: string, segment: string = "") => {
    setSelectedSummary(key);
    setDetailRows([]);

    const section = sectionMap[key];

    if (!section || !user_id) return;

    const payload = {
      loginId: user_id,
      section,
      tradeDate: tradeDate?.format("YYYY-MM-DD") ?? "",
      tradeNo: "",
      segment,
    };

    dispatch(showLoader("Fetching trade details..."));

    try {
      const response = await apiServices.GetIVRTradeSummary(payload);

      if (
        response?.status === 200 &&
        response?.data?.statusCode === 200 &&
        response?.data?.isSuccess
      ) {
        const result = response.data.data;

        const rows: unknown[] = Array.isArray(result)
          ? result
          : result && typeof result === "object"
            ? (Object.values(result).find(Array.isArray) ?? [result])
            : [];

        setDetailRows(
          rows
            .filter(
              (item): item is Record<string, unknown> =>
                item !== null &&
                typeof item === "object" &&
                !Array.isArray(item),
            )
            .map((item, index) => ({
              ...item,
              id: item.Row_Id ?? item.Rowid ?? item.Rowed ?? `${key}-${index}`,
              Status: item.Status ?? item[""] ?? "—",
            })),
        );
      } else {
        ShowToast(
          "error",
          response?.data?.message || "Failed to fetch trade details",
        );
      }
    } catch (error) {
      console.error("GetIVRTradeSummary error:", error);
      ShowToast("error", "Unable to fetch trade details");
    } finally {
      dispatch(hideLoader());
    }
  };

  const primaryCards = [
    {
      key: "offlineTrade",
      title: "Offline Trades",
      value: summaryData?.offlineTrade?.[0]?.Offline_TradeCount ?? 0,
    },
    {
      key: "onlineTrade",
      title: "Online Trades",
      value: summaryData?.onlineTrade?.[0]?.Online_TradeCount ?? 0,
    },
    {
      key: "totalTrade",
      title: "Total Trades",
      value: summaryData?.totalTrade?.[0]?.Total_TradeCount ?? 0,
    },
  ];

  const secondaryCards = [
    {
      title: "Match Count",
      value: summaryData?.matchCount?.[0]?.IVR_Match_OrderCount ?? 0,
      key: "matchCount",
    },
    {
      title: "Mismatch Count",
      value: summaryData?.mismatchCount?.[0]?.IVR_Mismatch_OrderCount ?? 0,
      key: "mismatchCount",
    },
    {
      title: "Segment Trade",
      value:
        summaryData?.segmentTrade?.reduce(
          (total, item) => total + (item.TradeCount ?? 0),
          0,
        ) ?? 0,
      key: "segmentTrade",
      segmentItems: summaryData?.segmentTrade ?? [],
    },
  ];
  const selectedCard = [...primaryCards, ...secondaryCards].find(
    (card) => card.key === selectedSummary,
  );

  return (
    <React.Fragment>
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
                    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#fff",
                    padding: "0.8rem 1rem",
                  }}
                >
                  <h4 className="card-title mb-0">{activeSubItem}</h4>
                </CardHeader>

                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Trade Date"
                        value={tradeDate}
                        onChange={(newDate) => setTradeDate(newDate)}
                        format="DD/MM/YYYY"
                        maxDate={dayjs()}
                        slotProps={{
                          textField: {
                            size: "small",
                            sx: {
                              width: 220,
                              backgroundColor: "#fff",
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  {summaryData && (
                    <>
                      {/* Row 1: Trade summary */}
                      <h5
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#344054",
                          marginBottom: "4px",
                        }}
                      >
                        Trade Summary
                      </h5>

                      <Row className="g-3 mb-2">
                        {primaryCards.map((card) => (
                          <Col key={card.key} xs={12} sm={6} lg={4}>
                            <SummaryCard
                              title={card.title}
                              value={card.value}
                              onClick={() => handleSummaryClick(card.key)}
                            />
                          </Col>
                        ))}
                      </Row>

                      {/* Row 2: Match, mismatch and segment summary */}
                      <h5
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: "#344054",
                          marginBottom: "4px",
                        }}
                      >
                        Match & Segment Summary
                      </h5>

                      <Row className="g-3">
                        {secondaryCards.map((card) => (
                          <Col md={4} sm={6} xs={12} key={card.key}>
                            <SummaryCard
                              title={card.title}
                              value={card.value}
                              segmentItems={card.segmentItems}
                              onClick={(segment) =>
                                handleSummaryClick(card.key, segment ?? "")
                              }
                            />
                          </Col>
                        ))}
                      </Row>

                      {/* Details section for future API integration */}
                      {selectedSummary && (
                        <Card
                          style={{
                            marginTop: "24px",
                            borderRadius: "12px",
                            border: "1px solid #E5EAF0",
                            boxShadow: "none",
                          }}
                        >
                          <CardHeader
                            style={{
                              backgroundColor: "#F8FAFC",
                              borderRadius: "12px 12px 0 0",
                            }}
                          >
                            <h5
                              className="mb-0"
                              style={{
                                fontSize: "15px",
                                fontWeight: 700,
                                color: "#11395C",
                              }}
                            >
                              {selectedCard?.title ?? "Trade Details"}
                            </h5>
                          </CardHeader>
                          <CardBody>
                            <UserInfoTable
                              selectedSummary={selectedSummary}
                              activeSubItem={activeSubItem}
                              T6Data={detailRows}
                            />
                          </CardBody>
                        </Card>
                      )}
                    </>
                  )}

                  {!summaryData && (
                    <div className="text-center py-4 text-muted">
                      No IVR summary data available.
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default IVRDashboard;
