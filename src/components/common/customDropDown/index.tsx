import React, { useEffect, useState } from "react";
import { Col, Label, Row, Button } from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import ShowToast from "../../../utils/toastUtils";

interface Option {
  label: string;
  value: string;
}

interface table {
  handleValues: (data: any) => void;
  tradeData: any;
}
const DropDown = ({ handleValues, tradeData }: table) => {
  const [selectedZone, setSelectedZone] = useState<Option | null>(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState<Option | null>(
    null
  );
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(null);

  // const data = useSelector((state: RootState) => state.dormantReport.data);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(userData, totalEntries);
  }, []);

  useEffect(() => {
    const Id = localStorage.getItem("Id");
    const userType = localStorage.getItem("uIdType");
    let payload = {
      user_id: Id,
      option: "zone",
      userType: userType == "Employee" ? "EMP" : "",
      zone: selectedZone?.value,
    };

    const username = "admin";
    const password = "admin";
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials); // Base64 encode
    const LoginauthHeader = `Basic ${encodedCredentials}`;

    const customHeaders = {
      Authorization: LoginauthHeader, // Use LoginauthHeader for this request
    };

    dispatch(showLoader(""));
    apiServices
      .getDropDown(payload, customHeaders)
      .then((res) => {
        console.log("Response-->", res);
        if (res?.status === 200) {
          let zoneDropdown = res?.data.map((item: any) => ({
            label: item.itemVal, // This will be displayed in the dropdown
            value: item.itemVal, // This will be the actual value
          }));
          console.log("dropdown value", zoneDropdown);
          setNoSortingGroup(zoneDropdown);

          // setSelectedNoSortingGroup(selectedNoSortingGroup);
        }
      })
      .catch((Err) => {
        console.log("Error", Err);
      });

    dispatch(hideLoader());
  }, [dispatch]);

  useEffect(() => {
    const Id = localStorage.getItem("Id");
    if (selectedZone) {
      const payload = {
        user_id: Id,
        option: "BranchByZone",
        userType: "EMP",
        zone: selectedZone.value, // Use the selected zone value
      };

      dispatch(showLoader(""));

      apiServices
        .getDropDown(payload)
        .then((res) => {
          console.log("response->", res);
          if (res?.status === 200) {
            let branchDropdown = res?.data.map((item: any) => ({
              label: item.itemVal, // Display value in dropdown
              value: item.itemVal, // Actual value of the dropdown item
            }));
            branchDropdown = [
              { label: "ALL", value: "ALL" },
              ...branchDropdown,
            ];

            setBranchCodeOptions(branchDropdown); // Set the updated branch dropdown
          }
          dispatch(hideLoader());
        })
        .catch((err) => {
          console.error("Error fetching branch data:", err);
          dispatch(hideLoader());
        });
    }
  }, [selectedZone, dispatch]); // This effect runs when `selectedZone` changes

  const handleSubmit = async () => {
    tradeData([]);
    // setSelectedZone(null);
    // setSelectedBranchCode(null);
    let Id = localStorage.getItem("Id");
    const payload = {
      user_id: Id,
      zone: selectedZone?.value,
      branchCode: selectedBranchCode?.value,
    };
    dispatch(showLoader(""));
    apiServices
      .ClientCash(payload)
      .then((response) => {
        console.log("ClientCashresponse", response);
        handleValues(response?.data?.data);
        dispatch(hideLoader());
        if (response?.status === 200) {
          ShowToast("error", response?.data);
          let { recordsTotal } = response?.data[0];
          setTotalEntries(recordsTotal);
          setUserData(response.data);
        }
      })
      .catch((error) => {
        console.log("Error->", error);
        // const zoneError = error.response?.data?.errors?.Zone["0"];
        // const branchCodeError = error?.response?.data?.errors?.BranchCode["0"];
        dispatch(hideLoader());
        ShowToast("error", error.response?.data?.message);
        // ShowToast("error", zoneError);
        // ShowToast("error", branchCodeError);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  document.title = "LKP Securities | Dormant Client Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row style={{ fontFamily: "Public Sans" }}>
            <Col lg={12}>
              <div>
                <Row>
                  <Col xl={3}>
                    <div className="mb-3" style={{ maxWidth: "300px" }}>
                      <Label
                        htmlFor="zone-select"
                        className="form-label text-muted label-font"
                      >
                        ZONE
                      </Label>
                      <Select
                        value={selectedZone}
                        onChange={(selectedOption) =>
                          setSelectedZone(selectedOption)
                        }
                        options={noSortingGroup}
                        isClearable
                        className="placeholder-font"
                        id="zone-select"
                      />
                    </div>
                  </Col>

                  <Col xl={3}>
                    <div className="mb-3" style={{ maxWidth: "300px" }}>
                      <Label
                        htmlFor="branch-code-select"
                        className="form-label text-muted label-font"
                      >
                        BRANCH CODE
                      </Label>
                      <Select
                        value={selectedBranchCode}
                        onChange={(selectedOption) =>
                          setSelectedBranchCode(selectedOption)
                        }
                        options={branchCodeOptions}
                        isClearable
                        className="placeholder-font"
                        id="branch-code-select"
                      />
                    </div>
                  </Col>
                  <Col className="d-flex flex-column-reverse">
                    <div className="mb-3" />
                    <Button
                      className="w-50"
                      style={{ backgroundColor: "#11395C" }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DropDown;
