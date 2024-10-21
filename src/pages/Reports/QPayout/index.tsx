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
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import Select from "react-select";
import DataTable from "../../../components/common/table";
import { GridColDef } from "@mui/x-data-grid";

interface Option {
  label: string;
  value: string;
}

const FinancialYears = [{ value: "2024-2025", label: "2024-2025" }];
const FinancialQuarters = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
];

const QuarterlyPayout = () => {
  const [qPayoutFinYear, setqPayoutFinYear] = useState<any>(null);
  const [selectfinancialQuarter, setSelectFiancialQuarter] =
    useState<Option | null>(null);
  const [userData, setUserData] = useState([]);
  const [totalEntries, setTotalEntries] = useState(null);

  const dispatch = useDispatch();

  function handleQpayoutFinYear(financialYear: any) {
    console.log("selectedValue", financialYear);
    setqPayoutFinYear(financialYear);
  }

  const handleSubmit = async () => {
    const payload = {
      start: 0,
      pageSize: 10,
      searchKey: "",
      userId: "EMP-5341",
      financialQtr: `2024-${selectfinancialQuarter?.value}`,
    };
    dispatch(showLoader(""));
    const result = await apiServices
      .GetQuaterlyPayoutGrid(payload)
      .then((response) => {
        console.log("responseQpayout", response?.data);
        const { recordsTotal } = response?.data[0];
        setTotalEntries(recordsTotal);
        dispatch(hideLoader());
        if (response?.status === 200) {
          setUserData(response.data);
        }
      })
      .catch((error) => {
        console.log("Error->", error);
        dispatch(hideLoader());
      });
  };

  const qpayoutColumns: GridColDef[] = [
    { field: "accountcode", headerName: "Client Code", width: 150 },
    { field: "clientName", headerName: "Client Name", width: 150 },
    { field: "rm", headerName: "RM", width: 150 },
    { field: "branchcode", headerName: "Branch Code", width: 150 },
    { field: "zone", headerName: "Zone", width: 100 },
    { field: "payout_Amt", headerName: "Payout Amt", width: 150 },
    { field: "receipt_Amt", headerName: "Receipt Amt", width: 150 },
    // { field: "payout_Amt", headerName: "Pending Amt", width: 150 }, //COMMENTED THIS BCOZ TABLE BREAKS
    { field: "extra_Payin", headerName: "Extra Payin", width: 150 },
  ];

  document.title = "LKP Securities | Quarterly Payout Recovery Report";

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Row style={{ fontFamily: "Public Sans" }}>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-0">
                    Quarterly Payout Recovery Report
                  </h4>
                </CardHeader>
                <CardBody>
                  <div>
                    <Row>
                      <Col xl={3}>
                        <div className="mb-3">
                          <Label
                            htmlFor="choices-single-no-sorting"
                            className="form-label text-muted"
                          >
                            Financial Year
                          </Label>
                          <Select
                            value={qPayoutFinYear}
                            onChange={(financialYear: any) => {
                              handleQpayoutFinYear(financialYear);
                            }}
                            options={FinancialYears}
                          />
                        </div>
                      </Col>

                      <Col xl={3}>
                        <div className="mb-3">
                          <Label
                            htmlFor="branch-code-select"
                            className="form-label text-muted"
                          >
                            QUARTER
                          </Label>
                          <Select
                            value={selectfinancialQuarter}
                            onChange={(selectedOption) =>
                              setSelectFiancialQuarter(selectedOption)
                            }
                            options={FinancialQuarters}
                            isClearable
                            id="branch-code-select"
                          />
                        </div>
                      </Col>
                      <Col xl={3} className="d-flex flex-column-reverse">
                        <div className="mb-3" />
                        <Button
                          style={{ backgroundColor: "#11395C" }}
                          onClick={handleSubmit}
                        >
                          Submit
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
                    tableData={userData}
                    dynamicHeader={qpayoutColumns}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* <DataTable /> */}
        </div>
      </div>
    </React.Fragment>
  );
};

export default QuarterlyPayout;
