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
  FormFeedback,
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

const financialYears = [{ value: "2023-2024", label: "2023-2024" }, ,];

const AnnualPNL = () => {
  const [finYear, setFinYear] = useState<any>("");
  const [pnlValues, setPnlValues] = useState<any>("");
  const [isFinYearValid, setIsFinYearValid] = useState(true);
  const [isClientCodeValid, setIsClientCodeValid] = useState(true);

  const dispatch = useDispatch();

  function handleDropDown(finYear: any) {
    setFinYear(finYear);
    setIsFinYearValid(true);
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("value", value);
    if (regEx.alphaNumeric.test(value)) {
      // setIsClientCodeValid(true);
      setPnlValues(value.toUpperCase().replace(/\s/g, ""));
    }
  };

  const handleExcel = async () => {
    console.log("submitClick", finYear.value, pnlValues);
    if (!finYear) {
      setIsFinYearValid(false);
      return;
    }
    if (!pnlValues) {
      setIsClientCodeValid(false);
      return;
    }
    let uId = localStorage.getItem("Id");
    const payload = {
      clientCode: pnlValues, //MT0600508
      finYear: finYear.value,
      userId: uId,
    };
    try {
      let token = localStorage.getItem("tkn");
      dispatch(showLoader("Please wait, We are Processing your Request"));
      const response = await axios.post(
        `https://middlewareapi.lkp.net.in${endpoints.GetPNL}`,
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
      setFinYear("");
      setPnlValues("");
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
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">Annual PNL Statement</h4>
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
                            Financial Year
                          </Label>
                          <Select
                            value={finYear}
                            onChange={(selectedNoSortingGroup: any) => {
                              handleDropDown(selectedNoSortingGroup);
                            }}
                            options={financialYears}
                            // styles={{
                            //   control: (provided: any, state: any) => ({
                            //     ...provided,
                            //     borderColor: !isFinYearValid
                            //       ? "red"
                            //       : provided.borderColor,
                            //   }),
                            // }}
                          />
                          {/* {!isFinYearValid && (
                            <div
                              style={{
                                color: "#DC3545",
                                marginTop: "5px",
                                fontSize: "14px",
                              }}
                            >
                              Please select a Financial Year.
                            </div>
                          )} */}
                        </div>
                      </Col>
                      <Col xl={4}>
                        <div className="mb-3">
                          <Label
                            htmlFor="choices-text-remove-button"
                            className="form-label text-muted"
                          >
                            Client Code
                          </Label>
                          <Input
                            invalid={!isClientCodeValid}
                            name="ClientCode"
                            type="text"
                            className="form-control"
                            value={pnlValues}
                            onChange={handleOnChange}
                            id="choices-text-remove-button"
                            data-choices
                            data-choices-limit="3"
                          />
                          {!isClientCodeValid && (
                            <FormFeedback>
                              Please enter a valid Client Code.
                            </FormFeedback>
                          )}
                        </div>
                      </Col>

                      <Col className="d-flex flex-column-reverse">
                        <div className="mb-3" />
                        <Button
                          className="w-50"
                          style={{ backgroundColor: "#11395C" }}
                          onClick={handleExcel}
                        >
                          Excel
                          <DownloadIcon />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
                <PNLNote />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AnnualPNL;
