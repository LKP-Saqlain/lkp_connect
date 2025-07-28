import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import ChartCard from "../../../components/common/ChartCard";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import dayjs from "dayjs";

interface OverviewProps {
  activeSubItem: string;
}

type ViewType = "Direct" | "Indirect" | "Total";

interface ChartData {
  direct: number[];
  indirect: number[];
  total: number[];
  dates: string[];
}

interface ChartConfig {
  title: string;
  data: ChartData;
}

interface ApiConfig {
  title: string;
  apiCall: (payload: any) => Promise<any>;
  optionType: string;
  mapping: Record<string, string>;
  setter: React.Dispatch<React.SetStateAction<ChartData>>;
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
  const [brokingRevenue, setBrokingRevenue] =
    useState<ChartData>(emptyChartData);
  const [tradedClients, setTradedClients] = useState<ChartData>(emptyChartData);
  const [revenuePerClient, setRevenuePerClient] =
    useState<ChartData>(emptyChartData);
  const [deliverySegment, setDeliverySegment] =
    useState<ChartData>(emptyChartData);
  const [intradaySegment, setIntradaySegment] =
    useState<ChartData>(emptyChartData);
  const [futuresRevenue, setFuturesRevenue] =
    useState<ChartData>(emptyChartData);
  const [optionsRevenue, setOptionsRevenue] =
    useState<ChartData>(emptyChartData);
  const [commodityFutures, setCommodityFutures] =
    useState<ChartData>(emptyChartData);
  const [commodityOptions, setCommodityOptions] =
    useState<ChartData>(emptyChartData);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const extractChartData = (
    resData: any[],
    mapping: Record<string, string>
  ): ChartData => ({
    direct: resData.map((item) => item[mapping.direct] ?? 0),
    indirect: resData.map((item) => item[mapping.indirect] ?? 0),
    total: resData.map((item) => item[mapping.total] ?? 0),
    dates: resData.map((item) => dayjs(item.tradeDate).format("DD-MMM-YY")),
  });

  const fetchChart = async (
    apiCall: (payload: any) => Promise<any>,
    payload: any,
    mapping: Record<string, string>,
    setState: React.Dispatch<React.SetStateAction<ChartData>>
  ) => {
    const response = await apiCall(payload);
    if (response?.status) {
      const resData = response?.data?.data || [];
      setState(extractChartData(resData, mapping));
    }
  };

  useEffect(() => {
    const apiConfigs: ApiConfig[] = [
      {
        title: "Total Broking Revenue for last 10 Days",
        apiCall: apiServices.GetBrokRevReport,
        optionType: "Brok_Rev",
        mapping: {
          direct: "direct_Gross_Brokerage",
          indirect: "indirect_Gross_Brokerage",
          total: "total_Gross_Brokerage",
        },
        setter: setBrokingRevenue,
      },
      {
        title: "Total Traded Clients for last 10 Days",
        apiCall: apiServices.GetTradedClientReport,
        optionType: "Traded_Client",
        mapping: {
          direct: "direct",
          indirect: "indirect",
          total: "total",
        },
        setter: setTradedClients,
      },
      {
        title: "Total Revenue Per Traded Clients for last 10 Days",
        apiCall: apiServices.GetRevenueTradedClientReport,
        optionType: "Revenue_Traded_Client",
        mapping: {
          direct: "direct_Gross_Brokerage_Per_Client",
          indirect: "indirect_Gross_Brokerage_Per_Client",
          total: "total_Gross_Brokerage",
        },
        setter: setRevenuePerClient,
      },
      {
        title: "Delivery Segment Revenue for last 10 Days",
        apiCall: apiServices.GetDeliverySegmentReport,
        optionType: "Delivery_Segment",
        mapping: {
          direct: "direct_Delivery",
          indirect: "indirect_Delivery",
          total: "total_Delivery",
        },
        setter: setDeliverySegment,
      },
      {
        title: "Intraday Segment Revenue for last 10 Days",
        apiCall: apiServices.GetIntradaySegmentReport,
        optionType: "Intraday_Segment",
        mapping: {
          direct: "direct_Intraday",
          indirect: "indirect_Intraday",
          total: "Total_Intraday",
        },
        setter: setIntradaySegment,
      },
      {
        title: "Futures Revenue for last 10 Days",
        apiCall: apiServices.GetFuturesRevenue,
        optionType: "Futures_Revenue",
        mapping: {
          direct: "direct_Futures",
          indirect: "indirect_Futures",
          total: "total_Futures",
        },
        setter: setFuturesRevenue,
      },
      {
        title: "Options Revenue for last 10 Days",
        apiCall: apiServices.GetOptionsRevenue,
        optionType: "Options_Revenue",
        mapping: {
          direct: "direct_Options",
          indirect: "indirect_Options",
          total: "total_Options",
        },
        setter: setOptionsRevenue,
      },
      {
        title: "Commodity Futures Revenue for last 10 Days",
        apiCall: apiServices.GetCommodityFuturesReport,
        optionType: "Commodity_Futures",
        mapping: {
          direct: "direct_Commodity_Futures",
          indirect: "indirect_Commodity_Futures",
          total: "total_Commodity_Futures",
        },
        setter: setCommodityFutures,
      },
      {
        title: "Commodity Options Revenue for last 10 Days",
        apiCall: apiServices.GetCommodityOptionsReport,
        optionType: "Commodity_Options",
        mapping: {
          direct: "direct_Commodity_Options",
          indirect: "indirect_Commodity_Options",
          total: "total_Commodity_Options",
        },
        setter: setCommodityOptions,
      },
    ];

    const loadAllData = async () => {
      try {
        dispatch(showLoader(""));

        await Promise.all(
          apiConfigs.map((config) =>
            fetchChart(
              config.apiCall,
              { user_ID: "EMP-0238", optionType: config.optionType },
              config.mapping,
              config.setter
            )
          )
        );
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        dispatch(hideLoader());
      }
    };

    loadAllData();
  }, [dispatch, user_id]);

  const handleViewChange = (index: number, value: ViewType) => {
    setSelectedViews((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const chartConfigs: ChartConfig[] = [
    { title: "Total Broking Revenue for last 10 Days", data: brokingRevenue },
    { title: "Total Traded Clients for last 10 Days", data: tradedClients },
    {
      title: "Total Revenue Per Traded Clients for last 10 Days",
      data: revenuePerClient,
    },
    {
      title: "Delivery Segment Revenue for last 10 Days",
      data: deliverySegment,
    },
    {
      title: "Intraday Segment Revenue for last 10 Days",
      data: intradaySegment,
    },
    { title: "Futures Revenue for last 10 Days", data: futuresRevenue },
    { title: "Options Revenue for last 10 Days", data: optionsRevenue },
    {
      title: "Commodity Futures Revenue for last 10 Days",
      data: commodityFutures,
    },
    {
      title: "Commodity Options Revenue for last 10 Days",
      data: commodityOptions,
    },
  ];

  useEffect(() => {
    console.log("Active Sub Item:", activeSubItem);
  }, [activeSubItem]);

  return (
    <div className="page-content">
      <Container fluid>
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
