import Revenue from "./BrokingRevenue";
import NonBrokingRevenue from "./NonBrokingRevenue";
const RevenueDetails = ({
  handleValues,
  handleRevenueRange,
  handleRevenueData,
}: any) => {
  return (
    <>
      <Revenue
        handleValues={handleValues}
        handleRevenueRange={handleRevenueRange}
        handleRevenueData={handleRevenueData}
      />
      <NonBrokingRevenue />
    </>
  );
};

export default RevenueDetails;
