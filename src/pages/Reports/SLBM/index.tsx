import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Input,
  Button,
} from "reactstrap";
import { regEx } from "../../../helper/method";
import DownloadIcon from "@mui/icons-material/Download";
import PNLNote from "../../../components/common/pnlNote";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import DataTable from "../../../components/common/table";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { endpoints } from "../../../services/endpoints";

const ClientStatus = [
  { value: "ALL", label: "ALL" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "INACTIVE", label: "INACTIVE" },
  //   { value: "Madrid", label: "Madrid" },
  //   { value: "Toronto", label: "Toronto" },
];

interface Option {
  label: string;
  value: string;
}

const SlbmHoling = () => {
  const [selectedNoSortingGroup, setSelectedNoSortingGroup] =
    useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<Option | null>(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState<Option | null>(
    null
  );
  const [selectedClientStatus, setSelectedClientStatus] =
    useState<Option | null>(null);
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState([]);
  const [isInValue, setIsInValue] = useState<any>("");
  const [userData, setUserData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(null);

  const dispatch = useDispatch();

  function handleSelectNoSortingGroup(selectedNoSortingGroup: any) {
    console.log("selectedValue", selectedNoSortingGroup);
    // setSelectedNoSortingGroup(selectedNoSortingGroup);
  }

  useEffect(() => {
    let payload = {
      user_id: "5341",
      option: "zone",
      userType: "EMP",
      zone: "ALL",
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
    const response = apiServices
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
    if (selectedZone) {
      const payload = {
        user_id: "5341",
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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("value", value);
    if (regEx.alphaNumeric.test(value)) {
      setIsInValue(value.toUpperCase().replace(/\s/g, ""));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      loginName: "EMP-5341", //THIS VALUES COMES FROM API
      start: 0,
      pageSize: 10,
      searchKey: "",
      zone: selectedZone?.value,
      branchCode: selectedBranchCode?.value,
      symbolISIN: isInValue,
    };
    dispatch(showLoader(""));
    const result = await apiServices
      .SLBMHoldingsReport(payload)
      .then((response) => {
        debugger;
        console.log("response", response?.data);
        console.log("response", response?.data?.sLBMHoldings[0]);
        const { recordsTotal } = response?.data?.sLBMHoldings[0];
        setTotalEntries(recordsTotal);
        dispatch(hideLoader());
        if (response?.status === 200) {
          setUserData(response.data?.sLBMHoldings);
        }
      })
      .catch((error) => {
        console.log("Error->", error);
        dispatch(hideLoader());
      });
  };

  const slbmColumns: GridColDef[] = [
    { field: "zone", headerName: "Zone", width: 100 },
    { field: "branchCode", headerName: "Branch Code", width: 150 },
    { field: "clientCode", headerName: "Client Code", width: 150 },
    { field: "clientName", headerName: "Client Name", width: 150 },
    { field: "scripName", headerName: "Scrip Name", width: 150 },
    { field: "isin", headerName: "ISIN", width: 150 },
    { field: "qtny", headerName: "Qtny", width: 100 },
    { field: "rmName", headerName: "RM Name", width: 150 },
    { field: "dealerName", headerName: "Dealer Name", width: 150 },
    { field: "slbmStatus", headerName: "SLBM Status", width: 150 },
  ];

  const handleDownloadExcel = async () => {
    const payload = {
      loginName: "EMP-5341", //THIS VALUES COMES FROM API
      start: 0,
      pageSize: 10,
      searchKey: "",
      zone: selectedZone?.value,
      branchCode: selectedBranchCode?.value,
      symbolISIN: isInValue,
    };
    try {
      let token = localStorage.getItem("tkn");
      dispatch(showLoader("Please wait, We are Processing your Request"));
      const response = await axios.post(
        `https://middlewareapi.lkp.net.in${endpoints.SLBMHoldingsReportExcel}`,
        payload,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.xlsx"); // Specify the file name
      document.body.appendChild(link);
      link.click();
      dispatch(hideLoader());
    } catch (error) {
      console.error("Download error", error);
      dispatch(hideLoader());
    }
  };

  document.title = "LKP Securities | Dormant Client Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row style={{ fontFamily: "Public Sans" }}>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">
                    SLBM Client Holding Report
                  </h4>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      <Col xl={3}>
                        <div className="mb-3" style={{ maxWidth: "300px" }}>
                          <Label
                            htmlFor="zone-select"
                            className="form-label text-muted"
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
                            id="zone-select"
                          />
                        </div>
                      </Col>

                      <Col xl={3}>
                        <div className="mb-3" style={{ maxWidth: "300px" }}>
                          <Label
                            htmlFor="branch-code-select"
                            className="form-label text-muted"
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
                            id="branch-code-select"
                          />
                        </div>
                      </Col>

                      <Col xl={3}>
                        <div className="mb-3">
                          <Label
                            htmlFor="choices-text-remove-button"
                            className="form-label text-muted"
                          >
                            SYMBOL / ISIN
                          </Label>
                          <Input
                            name="ISIN"
                            type="text"
                            className="form-control"
                            value={isInValue}
                            onChange={handleOnChange}
                            id="choices-text-remove-button"
                            data-choices
                            data-choices-limit="3"
                          />
                        </div>
                      </Col>

                      <Col className="d-flex flex-column-reverse">
                        <div className="mb-3" />
                        <Button
                          style={{ backgroundColor: "#11395C" }}
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </Col>

                      <Col className="d-flex flex-column-reverse">
                        <div className="mb-3" />
                        <Button
                          style={{ backgroundColor: "#11395C" }}
                          onClick={handleDownloadExcel}
                        >
                          Excel
                          <DownloadIcon />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <DataTable
                    totalRecords={totalEntries}
                    dynamicHeader={slbmColumns}
                    tableData={userData}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SlbmHoling;
