import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import { VendorProvider } from "./VendorContext";

const index = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();
  const [flag, setFlag] = useState<boolean>(false);
  const [vendorList, setVendorList] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const fetchApprover1 = async () => {
      const ViewPayload = {
        userID: user_id,
      };

      const vendorPayload = {
        userID: user_id,
        status: "",
        remarks: "",
      };

      try {
        dispatch(showLoader("Please wait, we are processing your request..."));

        const response = await apiServices.Approver1ViewUnlisted(ViewPayload);
        const vendorResponse = await apiServices.GetUnlistedVendorDropdown(
          vendorPayload
        );

        const mainData = response?.data?.data || [];
        const vendorData = vendorResponse?.data?.data || [];

        // ✅ Add Id = index + 1 for mainData
        const updatedMainData = mainData.map((item: any, index: number) => ({
          ...item,
          Id: index + 1,
        }));

        // ✅ Add Id = index + 1 for vendorData
        const updatedVendorData = vendorData.map(
          (item: any, index: number) => ({
            ...item,
            Id: index + 1,
          })
        );

        console.log("A1 Data", updatedMainData, updatedVendorData);

        // ⬅ Store updated data in state
        setData(updatedMainData);
        setVendorList(updatedVendorData);
      } catch (error) {
        console.error("Error fetching compliance data:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchApprover1();
  }, [dispatch, flag]);

  const handleApproval = (
    rid: number,
    remark: string,
    entryFlag: string,
    vendorName?: number
    // dealSheetB64?: string
  ) => {
    const payload = {
      rowID: rid,
      userID: user_id,
      // userID: "EMP-5347",
      status: entryFlag === "approve" ? "A" : "R",
      remarks: remark,
      vendorName: entryFlag === "approve" ? Number(vendorName) : null,
      // dealSheetB64: entryFlag === "approve" ? dealSheetB64 : null,
    };
    dispatch(showLoader("Approving..."));

    apiServices
      .ApproverActionUnlistedShares(payload)
      .then((response) => {
        // setFlag(!flag);
        if (response?.status === 200) {
          setFlag(!flag);
          ShowToast("success", response?.data?.data?.msg);
        } else {
          console.log("Error during approval", response);
          ShowToast("error", "Error approving item");
        }
      })
      .catch((error) => {
        ShowToast("info", error);
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
            <h4 className="card-title mb-0">Unlisted Shares Approval 1</h4>
          </CardHeader>
          <CardBody>
            <VendorProvider value={vendorList}>
              <DataTable
                activeSubItem={activeSubItem}
                T6Data={data}
                handleApproval={handleApproval}
              />
            </VendorProvider>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default index;
