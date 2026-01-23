import { useEffect, useState } from "react";
import BasicTabs from "../../../../components/common/MutualFunds/NavTabs";
import { Card } from "@mui/material";
import MutualFundTable from "../../../../components/common/MutualFunds/MfTable";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";

const tabList = [
  { label: "Completed" },
  { label: "In Process" },
  { label: "Failed" },
];

const MfOrder = () => {
  const [OrderTab, setOrderTab] = useState(0);
  const [orderData, setOrderData] = useState({
    inProgress: [],
    success: [],
    failed: [],
  });

  const dispatch = useDispatch<AppDispatch>();

  // Mapping tab label to data key
  const tabLabelToDataKey: Record<string, keyof typeof orderData> = {
    Completed: "success",
    "In Process": "inProgress",
    Failed: "failed",
  };

  const currentLabel = tabList[OrderTab]?.label;
  const currentRows = orderData[tabLabelToDataKey[currentLabel]];

  useEffect(() => {
    const fetchAndSortOrders = async () => {
      dispatch(showLoader("Please wait, we are processing your request"));

      try {
        const response = await apiServices.MF_TodayOrders();

        const rawOrders = response?.data?.data ?? [];
        const formattedData = rawOrders.map((item: any, index: number) => ({
          id: index + 1,
          ...item,
        }));
        // Group orders by successFlag
        const inProgressOrders = formattedData.filter(
          (order: any) => order.successFlag === "INPROGRESS"
        );
        const successOrders = formattedData.filter(
          (order: any) => order.successFlag === "SUCCESS"
        );
        const failedOrders = formattedData.filter(
          (order: any) => order.successFlag === "FAILED"
        );

        // Set grouped data
        setOrderData({
          inProgress: inProgressOrders,
          success: successOrders,
          failed: failedOrders,
        });
      } catch (error) {
        console.error("Error fetching and sorting MF orders:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchAndSortOrders();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setOrderTab(newValue);
    const label = tabList[newValue]?.label;
    console.log("Selected Tab Index:", newValue);
    console.log("Selected Tab Label:", label);
  };

  return (
    <>
      <Card sx={{ borderRadius: 4, p: 2, mb: 3 }}>
        <BasicTabs
          heading="Orders"
          tabs={tabList}
          value={OrderTab}
          onChange={handleTabChange}
        />
      </Card>

      <Card sx={{ borderRadius: 4, p: 2 }}>
        <MutualFundTable rows={currentRows} selectedLabel={currentLabel} />
      </Card>
    </>
  );
};

export default MfOrder;
