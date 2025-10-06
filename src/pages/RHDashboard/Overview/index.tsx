import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Label, Row } from "reactstrap";
import ChartCard from "../../../components/common/ChartCard";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import dayjs from "dayjs";
import DashboardCard from "../../../components/common/DashboardCard";
import ShowToast from "../../../utils/toastUtils";
import { useFormik } from "formik";

interface OverviewProps {
  activeSubItem: string;
}

type ViewType = "Direct" | "Indirect" | "Total";

interface ChartData {
  direct: number[];
  indirect: number[];
  total: number[];
  dates: string[];
  startDate?: string[];
}

interface MetricData {
  total: number;
  direct: number;
  indirect: number;
}

interface ChartConfig {
  title: string;
  data: ChartData;
}

const emptyChartData: ChartData = {
  direct: [],
  indirect: [],
  total: [],
  dates: [],
};

const Overview = ({ activeSubItem }: OverviewProps) => {
  const [selectedViews, setSelectedViews] = useState<ViewType[]>(
    Array(9).fill("Total")
  );

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  // ---- Metric States for 4 Dashboard Cards ----
  const [activeClientsData, setActiveClientsData] = useState<MetricData>({
    total: 0,
    direct: 0,
    indirect: 0,
  });
  const [uniqueTradedClientsData, setUniqueTradedClientsData] = useState<any>({
    total: 0,
    direct: 0,
    indirect: 0,
    MonthTotal: 0,
    directTotal: 0,
    indirectTotal: 0,
  });
  const [newAccountsData, setNewAccountsData] = useState<any>({
    total: 10,
    direct: 100,
    indirect: 1000,
    MonthTotal: 0,
    directTotal: 0,
    indirectTotal: 0,
  });
  const [upcomingDormantAccountsData, setUpcomingDormantAccountsData] =
    useState<MetricData>({
      total: 0,
      direct: 0,
      indirect: 0,
    });

  const [activeBadges, setActiveBadges] = useState<string[]>(
    Array(4).fill("total")
  );

  // ---- Chart States ----
  const [brokingRevenue, setBrokingRevenue] =
    useState<ChartData>(emptyChartData);
  const [tradedClients, setTradedClients] = useState<ChartData>(emptyChartData);
  const [newAccounts, setNewAccounts] = useState<ChartData>(emptyChartData);
  const [equitySegment, setEquitySegment] = useState<ChartData>(emptyChartData);
  const [futuresRevenue, setFuturesRevenue] =
    useState<ChartData>(emptyChartData);
  const [optionsRevenue, setOptionsRevenue] =
    useState<ChartData>(emptyChartData);
  const [commodityFutures, setCommodityFutures] =
    useState<ChartData>(emptyChartData);
  const [commodityOptions, setCommodityOptions] =
    useState<ChartData>(emptyChartData);
  const [slbmSegment, setSlbmSegment] = useState<ChartData>(emptyChartData);
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [selectedButtons, setSelectedButtons] = useState<
    Record<string, "MTD" | "YTD">
  >({
    "Unique Traded Clients": "MTD",
    "New Accounts Added": "MTD",
  });

  const extractChartData = (
    resData: any[],
    mapping: Record<string, string>
  ): ChartData => ({
    direct: resData.map((item) => item[mapping.direct] ?? 0),
    indirect: resData.map((item) => item[mapping.indirect] ?? 0),
    total: resData.map((item) => item[mapping.total] ?? 0),
    dates: resData.map((item) =>
      item.tradeDate
        ? dayjs(item.tradeDate).format("DD-MMM-YY")
        : item.startDate
        ? dayjs(item.startDate).format("DD-MMM-YY")
        : ""
    ),
    // startDate: resData.map((item) =>
    //   item.startDate ? dayjs(item.startDate).format("DD-MMM-YY") : ""
    // ),
  });

  interface FormValues {
    selectedZone: { label: string; value: string } | null;
  }

  const fetchChart = async (
    apiCall: (payload: any) => Promise<any>,
    payload: any,
    mapping: Record<string, string>,
    setState: React.Dispatch<React.SetStateAction<ChartData>>,
    isEquitySegment = false
  ) => {
    const response = await apiCall(payload);
    if (response?.status) {
      let resData = response?.data?.data || [];

      if (isEquitySegment) {
        // create combined fields on each item
        resData = resData.map((item: any) => ({
          ...item,
          direct_Equity:
            (item.direct_Delivery ?? 0) + (item.direct_Intraday ?? 0),
          indirect_Equity:
            (item.indirect_Delivery ?? 0) + (item.indirect_Intraday ?? 0),
          total_Equity: (item.total_Delivery ?? 0) + (item.total_Intraday ?? 0),
        }));

        // ✅ Correct logging
        console.log(
          "if (isEquitySegment) combined data:",
          resData,
          resData[0]?.direct_Equity // example of accessing the first item’s value
        );
      }

      setState(extractChartData(resData, mapping));
    }
  };

  useEffect(() => {
    if (accessType === "ALL") {
      const str = user_id;
      const userType = localStorage.getItem("uIdType");
      let extractUserId: string | null = null;

      if (str) {
        const parts = str.split("-");
        if (parts.length > 1) {
          extractUserId = parts[1];
        }
      }
      let payload = {
        user_id: str === "APN-7161" ? "5376" : extractUserId,
        option: "zone",
        userType:
          str === "APN-7161" ? "EMP" : userType === "Employee" ? "EMP" : "APN",
        zone: "ALL",
      };

      const username = "admin";
      const password = "admin";
      const credentials = `${username}:${password}`;
      const encodedCredentials = btoa(credentials); // Base64 encode
      const LoginauthHeader = `Basic ${encodedCredentials}`;

      const customHeaders = {
        Authorization: LoginauthHeader, // Use LoginauthHeader for this request
      };

      dispatch(showLoader("Please wait, we are processing your request..."));
      apiServices
        .getDropDown(payload, customHeaders)
        .then((res) => {
          console.log("Response-->", res);
          if (res?.status === 200) {
            let zoneDropdown = res?.data.map((item: any) => ({
              label: item.itemDesc, // This will be displayed in the dropdown
              value: item.itemVal, // This will be the actual value
            }));
            console.log("dropdown value", zoneDropdown);
            setNoSortingGroup(zoneDropdown);
            if (zoneDropdown.length > 0) {
              formik.setFieldValue("selectedZone", zoneDropdown[0]);
            }
            // setSelectedNoSortingGroup(selectedNoSortingGroup);
          }
        })
        .catch((Err) => {
          const { message } = Err.response.data;
          console.log("Error->", message);
          dispatch(hideLoader());
          // formik.setFieldError("password", message);
          const errorMessage = Err.response.data.message;
          ShowToast(
            "error",
            errorMessage ||
              "Sorry for the inconvenience, please try after some time."
          );
        });

      dispatch(hideLoader());
    }
  }, [dispatch, accessType]);

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
    },
    // validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("activeSubItem values1-->", activeSubItem, values);
      // handleSubmit(values);
      // handleDownloadExcel();
    },
  });
  const fetchDashboardMetrics = async () => {
    try {
      dispatch(showLoader(""));

      const payload = {
        userId: user_id,
        option: "",
        branchType: "All",
        monthDropdown: "",
        zoneCode: formik.values.selectedZone?.value || "ALL",
      };

      const [activeClientsRes, tradedClientsRes, newAccountsRes, dormantRes] =
        await Promise.all([
          apiServices.GetActiveClients({
            ...payload,
            option: "ActiveClients",
          }),
          apiServices.GetUniqueTradedClient({
            ...payload,
            option: "Unique_Traded_Client",
          }),
          apiServices.GetNewAccountAdded({
            ...payload,
            option: "New_Account_Added",
          }),
          apiServices.UpcomingDormantAccount({
            ...payload,
            option: "Upcoming_Dormant_Account",
          }),
        ]);

      if (activeClientsRes?.data?.isSuccess) {
        const d = activeClientsRes?.data?.data;
        setActiveClientsData({
          total: d.totalActiveClients ?? 0,
          direct: d.directClients ?? 0,
          indirect: d.indirectClients ?? 0,
        });
        console.log("d.indirectClients", d);
      }

      if (tradedClientsRes?.data?.isSuccess) {
        const d = tradedClientsRes.data?.data;
        setUniqueTradedClientsData({
          total: d.yearlyUTC_Total ?? 0,
          direct: d.yearlyUTC_Direct ?? 0,
          indirect: d.yearlyUTC_Indirect ?? 0,
          MonthTotal: d.monthlyUTC_Total ?? 0,
          directTotal: d.monthlyUTC_Direct ?? 0,
          indirectTotal: d.monthlyUTC_Indirect ?? 0,
        });
      }

      if (newAccountsRes?.data?.isSuccess) {
        const d = newAccountsRes.data?.data;
        setNewAccountsData({
          total: d.yearlyNA_Total ?? 0,
          direct: d.yearlyNA_Direct ?? 0,
          indirect: d.yearlyNA_Indirect ?? 0,
          MonthTotal: d.monthlyNA_Total ?? 0,
          directTotal: d.monthlyNA_Direct ?? 0,
          indirectTotal: d.monthlyNA_Indirect ?? 0,
        });
      }

      if (dormantRes?.data?.isSuccess) {
        const d = dormantRes.data?.data;
        setUpcomingDormantAccountsData({
          total: d.total ?? 0,
          direct: d.direct ?? 0,
          indirect: d.indirect ?? 0,
        });
      }
    } catch (err) {
      console.error("Failed to fetch dashboard metrics:", err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    // Chart-related API configs and call

    const selectedZoneValue = formik.values.selectedZone?.value || "ALL";
    const chartApiConfigs = [
      {
        title: "Brokerage Details for last 15 Days",
        apiCall: apiServices.GetOverviewBrokRevReport,
        optionType: "Brok_Details",
        mapping: {
          direct: "direct_Gross_Brokerage",
          indirect: "indirect_Gross_Brokerage",
          total: "total_Gross_Brokerage",
        },
        setter: setBrokingRevenue,
      },
      {
        title: "Unique Traded Clients for last 15 Days",
        apiCall: apiServices.GetOverviewUniqueTradedClients,
        optionType: "Unique_Traded_Client",
        mapping: {
          direct: "direct",
          indirect: "indirect",
          total: "total",
        },
        setter: setTradedClients,
      },
      {
        title: "New Accounts Added in last 15 Days",
        apiCall: apiServices.GetNewAccountAddedOverview,
        optionType: "New_Account_Added",
        mapping: {
          direct: "direct_NewAccount",
          indirect: "indirect_NewAccount",
          total: "total_NewAccount",
        },
        setter: setNewAccounts,
      },
      {
        title:
          "Equity (Delivery + Intraday) Segment Brokerage for last 15 Days",
        apiCall: apiServices.GetDeliverySegmentOverview,
        optionType: "Delivery_Segment_Intranet_segment",
        mapping: {
          direct: "direct_Equity",
          indirect: "indirect_Equity",
          total: "total_Equity",
        },
        setter: setEquitySegment,
      },

      {
        title: "Futures Segment Brokerage for last 15 Days",
        apiCall: apiServices.GetFuturesRevenueOverview,
        optionType: "Futures_Revenue",
        mapping: {
          direct: "direct_Futures",
          indirect: "indirect_Futures",
          total: "total_Futures",
        },
        setter: setFuturesRevenue,
      },
      {
        title: "Options Segment Brokerage for last 15 Days",
        apiCall: apiServices.GetOptionsRevenueOverview,
        optionType: "Options_Revenue",
        mapping: {
          direct: "direct_Options",
          indirect: "indirect_Options",
          total: "total_Options",
        },
        setter: setOptionsRevenue,
      },
      {
        title: "Commodity Future Segment Brokerage for last 15 Days",
        apiCall: apiServices.GetCommodity_FuturesOverview,
        optionType: "Commodity_Futures",
        mapping: {
          direct: "direct_Commodity_Futures",
          indirect: "indirect_Commodity_Futures",
          total: "total_Commodity_Futures",
        },
        setter: setCommodityFutures,
      },
      {
        title: "Commodity Options Segment Brokerage for last 15 Days",
        apiCall: apiServices.GetCommodity_OptionsOverview,
        optionType: "Commodity_Options",
        mapping: {
          direct: "direct_Commodity_Options",
          indirect: "indirect_Commodity_Options",
          total: "total_Commodity_Options",
        },
        setter: setCommodityOptions,
      },
      {
        title: "SLBM Segment Brokerage for last 15 Days",
        apiCall: apiServices.GetslbmOverview,
        optionType: "SLBM_Segment",
        mapping: {
          direct: "direct_slbm",
          indirect: "indirect_slbm",
          total: "total_slbm",
        },
        setter: setSlbmSegment,
      },
    ];

    const loadAllData = async () => {
      try {
        dispatch(showLoader(""));
        await Promise.all(
          chartApiConfigs.map((config) =>
            fetchChart(
              config.apiCall,
              {
                user_ID: user_id,
                optionType: config.optionType,
                zoneCode: selectedZoneValue,
              },
              config.mapping,
              config.setter,
              config.title.includes("Equity (Delivery + Intraday)")
            )
          )
        );
      } catch (err) {
        console.error("Error loading chart data:", err);
      } finally {
        dispatch(hideLoader());
      }
    };

    if (user_id && selectedZoneValue) {
      loadAllData();
    }
  }, [formik.values.selectedZone, user_id, dispatch]);

  const handleViewChange = (index: number, value: ViewType) => {
    setSelectedViews((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // const getMetricValue = (index: number): number => {
  //   const badge = activeBadges[index];
  //   const dataArray = [
  //     activeClientsData,
  //     uniqueTradedClientsData,
  //     newAccountsData,
  //     upcomingDormantAccountsData,
  //   ];
  //   console.log("badgeValue", badge, dataArray);

  //   return dataArray[index][badge as keyof MetricData] || 0;
  // };

  const getMetricValue = (index: number) => {
    const badge = activeBadges[index]; // here im getting all badgessss
    const data = metrics[index].data;
    return data[badge as keyof MetricData] || 0;
  };

  const chartConfigs: ChartConfig[] = [
    { title: "Brokerage Details for last 15 Days", data: brokingRevenue },
    { title: "Unique Traded Clients for last 15 Days", data: tradedClients },
    { title: "New Accounts Added in last 15 Days", data: newAccounts },
    {
      title: "Equity (Delivery + Intraday) Segment Brokerage for last 15 Days",
      data: equitySegment,
    },
    {
      title: "Futures Segment Brokerage for last 15 Days",
      data: futuresRevenue,
    },
    {
      title: "Options Segment Brokerage for last 15 Days",
      data: optionsRevenue,
    },
    {
      title: "Commodity Futures Segment Brokerage for last 15 Days",
      data: commodityFutures,
    },
    {
      title: "Commodity Options Segment Brokerage for last 15 Days",
      data: commodityOptions,
    },
    { title: "SLBM Segment Brokerage for last 15 Days", data: slbmSegment },
  ];

  const handleBadgeClick = (cardIndex: number, type: string) => {
    setActiveBadges((prev) => {
      const updated = [...prev];
      updated[cardIndex] = type;
      return updated;
    });
  };

  // const validationSchema = Yup.object({
  //   selectedZone: Yup.object().nullable().required("Zone is required"),
  // });

  useEffect(() => {
    console.log("testValues", uniqueTradedClientsData, newAccountsData);
  }, [uniqueTradedClientsData, newAccountsData]);

  useEffect(() => {
    fetchDashboardMetrics();
  }, [dispatch, user_id, formik.values.selectedZone?.value]);

  const metrics = [
    { title: "Active Clients", data: activeClientsData },
    { title: "Unique Traded Clients", data: uniqueTradedClientsData },
    { title: "New Accounts Added", data: newAccountsData },
    { title: "Upcoming Dormant Account", data: upcomingDormantAccountsData },
  ];

  return (
    <div className="page-content">
      <Container fluid>
        <form
          onChange={(option: any) =>
            formik.setFieldValue("selectedZone", option)
          }
          style={{ marginTop: "20px", zIndex: "1000" }}
        >
          {accessType === "ALL" && (
            <Card>
              <Row style={{ margin: "5px", minWidth: "100%" }}>
                <Col
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start", // or "center" if you want horizontal centering
                  }}
                >
                  <div className="m-1">
                    <div className="d-flex align-items-center gap-2">
                      {/* Label (not scrollable) */}
                      <Label
                        htmlFor="zone-select"
                        className="form-label text-muted label-font mb-0"
                        style={{ minWidth: "50px" }}
                      >
                        Zone
                      </Label>

                      {/* Scrollable horizontal buttons */}
                      <div
                        className="d-flex flex-nowrap gap-2 overflow-auto"
                        style={{ maxWidth: "100%" }}
                      >
                        {noSortingGroup.map((zone: any) => {
                          const isSelected =
                            formik.values.selectedZone?.value === zone.value;

                          return (
                            <Button
                              key={zone.value}
                              type="button"
                              style={{
                                minWidth: "60px",
                                whiteSpace: "nowrap",
                                fontSize: "12px",
                                padding: "2px",
                                borderRadius: "6px",
                                border: "1px solid #11395c",
                                backgroundColor: isSelected
                                  ? "#11395c"
                                  : "#ffffff",
                                color: isSelected ? "#ffffff" : "#11395c",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                formik.setFieldValue("selectedZone", zone)
                              }
                              onBlur={() =>
                                formik.setFieldTouched("selectedZone", true)
                              }
                            >
                              {zone.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Validation error message */}
                    {formik.touched.selectedZone &&
                      formik.errors.selectedZone && (
                        <div
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          {formik.errors.selectedZone}
                        </div>
                      )}
                  </div>
                </Col>
              </Row>
            </Card>
          )}
        </form>
        <Row style={{ marginTop: "20px" }}>
          {metrics.map((metric, index) => {
            const isToggleMetric =
              metric.title === "Unique Traded Clients" ||
              metric.title === "New Accounts Added";

            const selectedButton = selectedButtons[metric.title] || "MTD"; // per-card selected button
            const isMTD = selectedButton === "MTD";

            const badges = [
              {
                type: "warning",
                label: "Total",
                value: isToggleMetric
                  ? isMTD
                    ? metric.data.MonthTotal // MTD value
                    : metric.data.total // YTD value
                  : metric.data.total,
                isActive: activeBadges[index] === "total",
                onClick: () => handleBadgeClick(index, "total"),
              },
              {
                type: "info",
                label: "Direct",
                value: isToggleMetric
                  ? isMTD
                    ? metric.data.directTotal
                    : metric.data.direct
                  : metric.data.direct,
                isActive: activeBadges[index] === "direct",
                onClick: () => handleBadgeClick(index, "direct"),
              },
              {
                type: "primary",
                label: "Indirect",
                value: isToggleMetric
                  ? isMTD
                    ? metric.data.indirectTotal
                    : metric.data.indirect
                  : metric.data.indirect,
                isActive: activeBadges[index] === "indirect",
                onClick: () => handleBadgeClick(index, "indirect"),
              },
            ];

            return (
              <Col key={index} xxl={3} lg={3} md={6} sm={12}>
                <DashboardCard
                  title={metric.title}
                  value={getMetricValue(index)}
                  badges={badges}
                  customClass={true}
                  mainCustomClass={true}
                  selectedButton={selectedButton}
                  setSelectedButton={(val: any) =>
                    setSelectedButtons((prev) => ({
                      ...prev,
                      [metric.title]: val,
                    }))
                  }
                />
              </Col>
            );
          })}
        </Row>

        <Row>
          <Col xl={12}>
            {chartConfigs.map((config, index) => (
              <ChartCard
                key={index}
                title={config.title}
                selectedView={selectedViews[index]}
                viewOptions={["Direct", "Indirect", "Total"]}
                setSelectedView={(val: any) => handleViewChange(index, val)}
                directData={config.data.direct}
                indirectData={config.data.indirect}
                tradeDates={config.data.dates}
              />
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Overview;
