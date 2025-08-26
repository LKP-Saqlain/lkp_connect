import MutualFundTable from "../../../components/common/MutualFunds/MfTable";
import { mutualFundRows } from "../../../helper/commmon";

const MfPortfolio = () => {
  return (
    <div>
      MfPortfolio
      <MutualFundTable rows={mutualFundRows} />
    </div>
  );
};

export default MfPortfolio;
