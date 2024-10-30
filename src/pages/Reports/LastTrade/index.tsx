import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Input,
  Button,
  CardTitle,
  CardText,
} from "reactstrap";
import { regEx } from "../../../helper/method";
import DownloadIcon from "@mui/icons-material/Download";
import PNLNote from "../../../components/common/pnlNote";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import axios from "axios";

import Select from "react-select";
import { endpoints } from "../../../services/endpoints";

const ClientStatus = [
  { value: "ALL", label: "ALL" },
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "INACTIVE", label: "INACTIVE" },
  //   { value: "Madrid", label: "Madrid" },
  //   { value: "Toronto", label: "Toronto" },
];

const LastTrade = () => {
  const [selectedClientStatus, setSelectedClientStatus] = useState<any>(null);

  const [pnlValues, setPnlValues] = useState<any>("");

  const dispatch = useDispatch();

  function handleSelectDropdown(selectedNoSortingGroup: any) {
    setSelectedClientStatus(selectedNoSortingGroup);
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("value", value);
    if (regEx.alphaNumeric.test(value)) {
      setPnlValues(value.toUpperCase().replace(/\s/g, ""));
    }
  };

  const handleExcel = async () => {
    console.log("submitClick", selectedClientStatus.value, pnlValues);

    const str = localStorage.getItem("Id");
    let extractUserId: string | null = null;

    if (str) {
      const parts = str.split("-");
      if (parts.length > 1) {
        extractUserId = parts[1];
      }
    }

    const payload = {
      user_id: extractUserId,
      active: selectedClientStatus.value,
    };
    dispatch(showLoader("Please wait, We are Processing your Request"));

    try {
      let token = localStorage.getItem("tkn");
      dispatch(showLoader("Please wait, We are Processing your Request"));
      const response = await axios.post(
        `https://middlewareapi.lkp.net.in${endpoints.lastTradeDate}`,
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

  document.title = "LKP Securities | Annual PNL Statement";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row style={{ fontFamily: "Public Sans" }}>
            <Col lg={12}>
              <Card style={{ minHeight: "85vh" }}>
                <CardHeader>
                  <h4 className="card-title mb-0">Last Trade</h4>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      <Col xl={4}>
                        <div className="mb-3">
                          <Label
                            htmlFor="choices-single-no-sorting"
                            className="form-label text-muted"
                          >
                            Select Client Status
                          </Label>
                          <Select
                            value={selectedClientStatus}
                            onChange={(selectedClientStatus: any) => {
                              handleSelectDropdown(selectedClientStatus);
                            }}
                            options={ClientStatus}
                          />
                        </div>
                      </Col>

                      <Col xl={4} className="d-flex flex-column-reverse">
                        <div className="mb-3" />
                        <Button
                          className="w-50"
                          style={{ backgroundColor: "#11395C" }}
                          onClick={handleExcel}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LastTrade;
