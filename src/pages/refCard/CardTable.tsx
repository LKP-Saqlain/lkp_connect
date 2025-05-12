import { useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import "./style.css";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { ButtonsLabel } from "../../helper/commmon";
import AccountButton from "../../components/common/AccountButton/index";

const CardTable = ({ activeSubItem, tableData, customTableFlag }: any) => {
  const [selectedButton, setSelectedButton] = useState<string>();
  const [data, setData] = useState<any>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { afterToday } = DateRangePicker;

  const selectedStyle = {
    backgroundColor: "#464b51",
    height: "23px",
    borderRadius: "4px",
    fontSize: "10px",
    padding: "3px",
    fontFamily: "Public Sans",
  };

  const nonSelectedStyle = {
    height: "23px",
    borderRadius: "4px",
    fontSize: "10px",
    padding: "3px",
    fontFamily: "Public Sans",
  };

  useEffect(() => {
    // setData([]);

    switch (selectedButton) {
      case "Daily":
        const filteredDaily = tableData.filter(
          (data: any) => data?.datatype === "Daily"
        );
        setData(filteredDaily);
        break;
      case "Weekly":
        const filteredWeekly = tableData.filter(
          (data: any) => data?.datatype === "weekly"
        );
        setData(filteredWeekly);
        break;
      case "Monthly":
        const filteredMonthly = tableData.filter(
          (data: any) => data?.datatype === "monthly"
        );
        setData(filteredMonthly);
        break;
      case "Yearly":
        const filteredYearly = tableData.filter(
          (data: any) => data?.datatype === "yearly"
        );
        setData(filteredYearly);
        break;
      case "last7days":
        const filteredLastDays = tableData.filter(
          (data: any) => data?.datatype === "last7days"
        );
        setData(filteredLastDays);
        break;
      default:
        break;
    }
  }, [selectedButton]);

  const renderTime = (value: string) => {
    setSelectedButton((curr) => (curr === value ? undefined : value));
    console.log(value);
  };

  const handleDateChange = (value: any) => {
    const formattedStartDate = moment(value[0]).format("DD/MM/YYYY");
    const formattedEndDate = moment(value[1]).format("DD/MM/YYYY");
    console.log(
      "Selected Date Range:",
      `${formattedStartDate} - ${formattedEndDate}`
    );
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          className="main-card"
          style={{
            top: isMobile ? "35px" : "0",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            className=""
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">
              {customTableFlag === "table-1"
                ? "Account opening"
                : customTableFlag === "table-2"
                ? "Account opening"
                : customTableFlag === "table-3"
                ? "Active logged in users"
                : customTableFlag === "table-4"
                ? "Active traded users"
                : customTableFlag === "table-5"
                ? "Number of Executed orders"
                : customTableFlag === "table-6"
                ? "Brokerage Revenue"
                : customTableFlag === "table-7"
                ? "Net brokerage revenue"
                : ""}
            </h4>
            <div
              className="gap-1"
              style={{
                flexDirection: isMobile ? "column" : "row",
                display: "flex",
              }}
            >
              {ButtonsLabel.map((button) => (
                <AccountButton
                  key={button.id}
                  label={button.label}
                  onClick={() => renderTime(button.label)}
                  isSelected={selectedButton === button.label}
                />
              ))}
              <Button
                style={
                  selectedButton === "fromToDate"
                    ? selectedStyle
                    : nonSelectedStyle
                }
                className="btn-sm"
                onClick={() => renderTime("fromToDate")}
              >
                From and To Date
              </Button>
              {selectedButton === "fromToDate" && (
                <DateRangePicker
                  size="xs"
                  onOk={handleDateChange}
                  placeholder="Select Start date & End date"
                  showOneCalendar
                  shouldDisableDate={afterToday()}
                />
              )}
            </div>
          </CardHeader>
          <CardBody className="main-card-body">
            <DataTable
              activeSubItem={activeSubItem}
              //   T6Data={tableData}
              T6Data={selectedButton ? data : tableData}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default CardTable;
