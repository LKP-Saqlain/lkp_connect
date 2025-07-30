import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";

const ThirdPartyApproval = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();
  const [flag, setFlag] = useState<boolean>(false);
  console.log(activeSubItem, "activeSubItemThir");

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const fetchApprover = () => {
      const payload = {
        user_id: user_id,
        // user_id: "EMP-0656",
      };
      dispatch(showLoader("Please wait, we are processing your request..."));

      apiServices
        .ThirdPartyApproverView(payload)
        .then((response) => {
          console.log("A1 Data", response?.data?.data);
          setData(response?.data?.data);
        })
        .catch((error) => {
          console.error("Error fetching compliance data:", error);
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };
    fetchApprover();
  }, [dispatch, flag]);

  const handleApproval = (rid: number, remark: string, entryFlag: string) => {
    const payload = {
      rowID: rid,
      user_id: user_id,
      // user_id: "EMP-0656",
      status: entryFlag,
      remarks: remark,
    };
    dispatch(showLoader("Approving..."));
    apiServices
      .ThirdPartyApproverAction(payload)
      .then((response) => {
        // setFlag(!flag);
        if (response?.status === 200) {
          setFlag(!flag);
          ShowToast("success", response?.data?.data?.message);
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
            <h4 className="card-title mb-0">
              Third Party Vendor Approval Master
            </h4>
          </CardHeader>
          <CardBody>
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={data}
              handleApproval={handleApproval}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ThirdPartyApproval;
