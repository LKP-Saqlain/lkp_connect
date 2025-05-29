import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

const KycBrokerage = ({ activeSubItem }: any) => {
  const [kycData, setKycData] = useState([]);
  const [flag, setFlag] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  useEffect(() => {
    dispatch(showLoader("Please wait..."));
    apiServices
      .GetBrokerageKycStatus({})
      .then((response) => {
        if (response?.status === 200) {
          console.log("kyc-data", response?.data?.data);
          setKycData(response?.data?.data);
        }
      })
      .catch((err) => console.log("Error", err))
      .finally(() => dispatch(hideLoader()));
  }, [flag]);

  const handleApproval = async (
    fullRow: {
      rowId: number;
      segment: string;
      clientcode: number;
      moduleNo: number;
    },
    remark: string,
    entryFlag: string
  ) => {
    const payload = {
      rowID: fullRow.rowId,
      kycflag: entryFlag,
      kycUserId: user_id,
      kycRemark: remark,
    };

    dispatch(showLoader("Please wait..."));
    // Always call KYC API
    const kycPromise = await apiServices.UpdateBrokerageKycStatus(payload);
    // Conditionally call second API
    let techExcelPromise: Promise<any> = Promise.resolve();

    if (entryFlag === "A") {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      const secondPayload = {
        segment: fullRow.segment,
        clientcode: fullRow.clientcode,
        startdate: formattedDate,
        moduleNo: fullRow.moduleNo,
      };

      techExcelPromise = apiServices.GetTechExcelApiResponse(secondPayload);

      console.warn(
        "Approval clicked for:",
        fullRow.segment,
        fullRow.clientcode,
        fullRow.moduleNo,
        "on",
        formattedDate
      );
    }

    // Wait for both APIs
    Promise.all([kycPromise, techExcelPromise])
      .then(([kycRes]) => {
        if (kycRes?.status === 200) {
          setFlag((prev) => !prev);
        } else {
          console.error("KYC API failed", kycRes);
        }
      })
      .catch((err) => {
        console.error("API call failed", err);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">
              KYC - Brokerage modification approval
            </h4>
          </CardHeader>
          <CardBody>
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={kycData}
              handleApproval={handleApproval}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default KycBrokerage;
