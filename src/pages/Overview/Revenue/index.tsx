import Revenue from "./BrokingRevenue";
import NonBrokingRevenue from "./NonBrokingRevenue";
const RevenueDetails = ({
  handleValues,
  handleRevenueRange,
  handleRevenueData,
  setTradedClientCount,
}: any) => {
  return (
    <>
      <Revenue
        handleValues={handleValues}
        handleRevenueRange={handleRevenueRange}
        handleRevenueData={handleRevenueData}
        setTradedClientCount={setTradedClientCount}
      />
      <NonBrokingRevenue />
    </>
  );
};

export default RevenueDetails;
