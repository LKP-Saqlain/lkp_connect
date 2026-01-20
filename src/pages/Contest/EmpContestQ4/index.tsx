import { Col, Row } from "reactstrap";
import DashboardCard from "../../../components/common/DashboardCard";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import theme from "../../../theme";
import RevenueImg from "../../../assets/images/revenue_new.json";
import ActiveClient from "../../../assets/images/Clients.json";
import CoinIcon from "../../../assets/images/coins.json";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import AchieveCard from "./AchieveCard";

interface APContestData {
  rowId: number;
  apCode: string;
  apName: string;
  zone: string;
  qtarget: number;
  newClientCount: number;
  prize: string;
  fcm: number;
  mfnet: number;
  fresh_cash: number;
  mf_aum: number;
  spip_cnt: number;
  ins_t: number;
  rprd_tg: number;
  mtf_cl_tg: number;
  mtf_ult_tg: number;
}

const EMPContestQ4 = ({ activeMenu }: any) => {
  const [revenueCard, setRevenueCard] = useState({
    broking: 0,
    nonBroking: 0,
    freeCash_Margin: 0,
    mfAUM_NET: 0,
    newClient: 0,
    reactivate: 0,
  });
  const [achieveCard, setAchieveCard] = useState({
    broking: 0,
    nonBroking: 0,
    freeCash_Margin: 0,
    mfAUM_NET: 0,
    newClient: 0,
    reactivate: 0,
    spipAchieved: 0,
    insuranceAchieved: 0,
    MTFActiveClient: 0,
    MTFClientAchieved: 0,
    MTFUtilisationAchieved: 0,
    researchProductAchieved: 0,
  });
  const [targetData, setTargetData] = useState<APContestData | null>(null);
  const [achievedData, setAchievedData] = useState<APContestData | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    console.log("TestData111", targetData?.mtf_cl_tg, targetData?.mtf_ult_tg);
  }, [targetData]);

  useEffect(() => {
    const payload = { user_id: user_id, quarterPeriod: "Q4-2526" };
    dispatch(showLoader(""));
    Promise.all([
      apiServices.GetEMPContestTargetDetails(payload),
      apiServices.GetEmpContestAchievedSummary(payload),
    ])

      .then(([GetEMPContestTargetDetails, GetEmpContestAchievedSummary]) => {
        if (GetEMPContestTargetDetails?.status === 200) {
          const data = GetEMPContestTargetDetails?.data?.data?.[0] || {};
          console.log("testTEST1111111", data);

          const {
            nca: newClient = 0,
            rac: reactivate = 0,
            brt: broking = 0,
            nbrt: nonBroking = 0,
            fcm: freeCash_Margin = 0,
            mfnet: mfAUM_NET = 0,
          } = data;

          setTargetData(data);
          setRevenueCard({
            broking,
            nonBroking,
            freeCash_Margin,
            mfAUM_NET,
            newClient,
            reactivate,
          });
        }
        if (GetEmpContestAchievedSummary?.status === 200) {
          const data = GetEmpContestAchievedSummary?.data?.data || {};
          console.log(data, "GetEmpContestAchievedSummary");
          setAchievedData(data);
          console.log("achievedData11", achievedData);

          const broking = (data.bb_nlkp || 0) + (data.slbm_nlkp || 0);
          // (data.brokerageNetToLKP || 0) + (data.slbmNetToLKPBrokerage || 0);

          // const nonbroking =
          //   (data.spipRevenue || 0) +
          //   (data.loanRevenue || 0) +
          //   (data.trilogyRevenue || 0) +
          //   (data.mfNetToLKP || 0) +
          //   (data.netToLKPInsurance || 0) +
          //   (data.liquiLoanNetToLKPBrokerage || 0);
          const nonbroking =
            (data.spip_rev || 0) +
            (data.ln_rev || 0) +
            (data.trl_rev || 0) +
            (data.mf_nlkp || 0) +
            (data.ins_nlkp || 0) +
            (data.liq_nlkp || 0);

          const freeCash_Margin = data.fresh_cash || 0;
          const mfAUM_NET = data.mf_aum || 0;
          const newClient = data.new_cl || 0;
          const reactivate = data.react_cl || 0;
          const spipAchieved = data.spip_cnt || 0;
          const insuranceAchieved = data.ins_ach || 0;
          const MTFActiveClient = data.mtf_cl_tg;
          const MTFClientAchieved = data.mtf_cl_ach;
          const MTFUtilisationAchieved = data.mtf_ult_ach;
          const researchProductAchieved = data.spip_rev + data.trl_rev;

          setAchieveCard({
            broking,
            nonBroking: nonbroking,
            freeCash_Margin,
            mfAUM_NET,
            newClient,
            reactivate,
            spipAchieved,
            insuranceAchieved,
            MTFActiveClient,
            MTFClientAchieved,
            MTFUtilisationAchieved,
            researchProductAchieved,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching contest target details:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, []);

  function formatIndianNumber(
    value?: number,
    showCurrency: boolean = true
  ): string {
    if (typeof value !== "number" || isNaN(value))
      return showCurrency ? "₹0" : "0";
    const formatted = value.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });
    return showCurrency ? `₹${formatted}` : formatted;
  }

  return (
    <div>
      <Row style={{ marginTop: "20px" }}>
        <Col xxl={3} lg={3} md={6} sm={12}>
          <DashboardCard
            activeMenu={activeMenu}
            title="Revenue Target"
            value={formatIndianNumber(revenueCard.broking)}
            animationData={RevenueImg}
            note={isMobile && `* Contest Period - 1st Jan to 31st Mar`}
            customClass={true}
            rightValue={formatIndianNumber(revenueCard.nonBroking)}
            subHeading="Broking"
            rightSubHeading="Non-Broking"
          />
        </Col>

        <Col xxl={3} lg={3} md={6} sm={12}>
          <DashboardCard
            activeMenu={activeMenu}
            title="Clients Target"
            value={revenueCard.newClient}
            animationData={ActiveClient}
            // badges={clientBadges}
            subHeading="New Clients"
            customClass={true}
            rightValue={
              revenueCard.reactivate === 0 ? "0" : revenueCard.reactivate
            }
            rightSubHeading="Reactivate"
          />
        </Col>

        <Col xxl={3} lg={3} md={6} sm={12}>
          <DashboardCard
            activeMenu={activeMenu}
            title="Fresh Cash Margin Target"
            value={formatIndianNumber(targetData?.fcm)}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="MF AUM Target"
            rightValue={formatIndianNumber(targetData?.mfnet)}
          />
        </Col>
        <Col xxl={3} lg={3} md={6} sm={12}>
          <DashboardCard
            activeMenu={activeMenu}
            title="Research Product Target"
            value={formatIndianNumber(targetData?.rprd_tg, false)}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="Insurance Target"
            rightValue={formatIndianNumber(targetData?.ins_t, false)}
          />
        </Col>
      </Row>
      <Row>
        <Col xxl={3} lg={3} md={6} sm={12}>
          <DashboardCard
            activeMenu={activeMenu}
            title="Revenue Achieved"
            value={formatIndianNumber(achieveCard.broking)}
            animationData={RevenueImg}
            subHeading="Broking"
            customClass={true}
            rightValue={formatIndianNumber(achieveCard.nonBroking)}
            rightSubHeading="Non-Broking"
          />
        </Col>

        <Col xxl={3} lg={3} md={6} sm={12}>
          <DashboardCard
            activeMenu={activeMenu}
            title="Clients Achieved"
            value={achieveCard.newClient}
            animationData={ActiveClient}
            // badges={clientBadges}
            subHeading="New Clients"
            customClass={true}
            rightValue={
              achieveCard.reactivate === 0 ? "0" : achieveCard.reactivate
            }
            rightSubHeading="Reactivate"
          />
        </Col>

        <Col xxl={3} lg={3} md={6} sm={12}>
          <DashboardCard
            activeMenu={activeMenu}
            title="Fresh Cash Margin Achieved"
            value={formatIndianNumber(achieveCard.freeCash_Margin)}
            // value={achieveCard.freeCash_Margin}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="MF AUM Achieved"
            rightValue={"0"}
          />
        </Col>
        <Col xxl={3} lg={3} md={6} sm={12}>
          <DashboardCard
            activeMenu={activeMenu}
            title="Research Product Achieved"
            value={achieveCard.researchProductAchieved}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="Insurance Achieved"
            rightValue={achieveCard.insuranceAchieved}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "15px" }}>
        <Col xxl={3} lg={3} md={6} sm={12}>
          {targetData && (
            <DashboardCard
              activeMenu={activeMenu}
              title="MTF Active Client"
              // value={achieveCard.MTFActiveClient}
              value={formatIndianNumber(targetData?.mtf_cl_tg, false)}
              animationData={CoinIcon}
              customClass={true}
              rightTitle="MTF Utilisation Target"
              rightValue={targetData && targetData?.mtf_ult_tg}
            />
          )}
        </Col>
        <Col xxl={3} lg={3} md={6} sm={12}>
          <DashboardCard
            activeMenu={activeMenu}
            title="MTF Client Achieved"
            value={achieveCard.MTFClientAchieved}
            animationData={CoinIcon}
            customClass={true}
            rightTitle="MTF Utilisation Achieved"
            rightValue={achieveCard.MTFUtilisationAchieved}
          />
        </Col>
      </Row>
      <AchieveCard />
    </div>
  );
};

export default EMPContestQ4;
