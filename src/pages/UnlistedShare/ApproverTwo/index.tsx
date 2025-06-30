import { Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";

const index = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();
  const [flag, setFlag] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const fetchApprover2 = () => {
      const payload = {
        userID: user_id,
        // userID: "EMP-3699",
      };
      dispatch(showLoader("Please wait, we are processing your request..."));

      apiServices
        .Approver2ViewUnlisted(payload)
        .then((response) => {
          console.log("A2 Data", response?.data?.data);
          setData(response?.data?.data);
        })
        .catch((error) => {
          console.error("Error fetching compliance data:", error);
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    };

    fetchApprover2();
  }, [dispatch, flag]);

  const handleApproval = (rid: number, remark: string, entryFlag: string) => {
    const payload = {
      rowID: rid,
      userID: user_id,
      //   userID: "EMP-3699",
      status: entryFlag === "A" ? "Approved" : "Rejected",
      remarks: remark,
    };
    dispatch(showLoader("Approving..."));

    apiServices
      .ApproverActionUnlistedShares(payload)
      .then((response) => {
        // setFlag(!flag);
        if (response?.status === 200) {
          setFlag(!flag);
          ShowToast("success", response?.data.Table[0]?.Message);
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
            <h4 className="card-title mb-0">Approver Two</h4>
          </CardHeader>
          <CardBody>
            <DataTable
              activeSubItem={activeSubItem}
              T6Data={data}
              handleApproval={handleApproval}
              // handleDownload={handleDownload}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default index;
