import React, { useEffect, useState } from "react";
import { Col, Label, Row, Button } from "reactstrap";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import ShowToast from "../../../utils/toastUtils";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

interface Option {
  label: string;
  value: string;
}

interface table {
  handleValues: (data: any, responseStatus?: any) => void;
  tradeData: any;
  setCustomLedgerData: any;
}

// interface CliWithCashBalance {
//   ClientName: string;
//   ClientCode: string;
//   LastTradeDate: string;
//   Cash: string;
// }
const DropDown = ({ handleValues, tradeData, setCustomLedgerData }: table) => {
  const [selectedZone, setSelectedZone] = useState<Option | null>(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState<Option | null>(
    null
  );
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [userData, setUserData] = useState([]);
  const [responseStatus, setResponseStatus] = useState(false);
  // const [totalEntries, setTotalEntries] = useState(null);

  // const data = useSelector((state: RootState) => state.dormantReport.data);
  const dispatch = useDispatch<AppDispatch>();

  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  console.log("accessType", typeof accessType);

  useEffect(() => {
    console.log(userData);
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
    console.log(
      "dropdown options",
      selectedBranchCode?.value,
      selectedZone?.value
    );
    tradeData([]);
    // setSelectedZone(null);
    // setSelectedBranchCode(null);
    let Id = localStorage.getItem("Id");
    const payload = {
      user_id: Id,
      zone: accessType === "" ? "ALL" : selectedZone?.value,
      branchCode: accessType === "" ? "ALL" : selectedBranchCode?.value,
    };
    dispatch(showLoader(""));
    apiServices
      .ClientCash(payload)
      .then((response) => {
        console.log(
          "dropdown options ClientCashresponse",
          response?.data?.data,
          response
        );
        // handleValues(response?.data?.data);
        dispatch(hideLoader());

        if (response?.status === 200 && typeof response?.data === "object") {
          setResponseStatus(true);
          setUserData(response?.data?.data);
          setCustomLedgerData(response?.data?.data);
          handleValues(response?.data?.data, true);
        } else {
          setResponseStatus(false); // hide search field if no valid data
          setCustomLedgerData([]);
          ShowToast("error", response?.data);
          handleValues([], false);
        }

        if (response?.status === 200) {
          setResponseStatus(true);
          console.log("userData", !responseStatus);
          setUserData(response?.data?.data);
          console.log("userData", response);
          const dataTypeCheck = response?.data;
          if (typeof dataTypeCheck === "object") {
            setCustomLedgerData(response?.data?.data);
          } else {
            ShowToast("error", response?.data);
            setCustomLedgerData([]);
          }
        }
      })
      .catch(() => {
        setCustomLedgerData([]);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
  // const handleExcelDownload = () => {
  //   tradeData([]);
  //   let Id = localStorage.getItem("Id");
  //   const payload = {
  //     user_id: Id,
  //     zone: selectedZone?.value,
  //     branchCode: selectedBranchCode?.value,
  //   };
  //   dispatch(showLoader(""));
  //   apiServices
  //     .ClientCash(payload)
  //     .then((response) => {
  //       console.log("ClientCashresponse", response);
  //       dispatch(hideLoader());
  //       const data: CliWithCashBalance[] = response?.data?.data;
  //       // Convert data to a worksheet
  //       const worksheet = XLSX.utils.json_to_sheet(data);
  //       // Create a workbook and append the worksheet
  //       const workbook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(workbook, worksheet, "Clients Ageing Report Data");
  //       // Convert the workbook to a binary file
  //       const excelBuffer = XLSX.write(workbook, {
  //         bookType: "xlsx",
  //         type: "array",
  //       });
  //       const excelFile = new Blob([excelBuffer], {
  //         type: "application/octet-stream",
  //       });
  //       saveAs(excelFile, "Client_With_Cash_Balance.xlsx");
  //     })
  //     .catch((error) => {
  //       console.log("Error->", error);
  //       dispatch(hideLoader());
  //       ShowToast("error", error.response?.data?.message);
  //     })
  //     .finally(() => {
  //       dispatch(hideLoader());
  //     });
  // };

  document.title = "LKP Securities | Trading";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {accessType !== "" && (
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
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default DropDown;
