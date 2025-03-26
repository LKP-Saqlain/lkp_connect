import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ButtonGroup from "../../common/ButtonGroup";
import "./style.css";

const selectedStyle = {
  bgcolor: "#11395C",
  color: "#fff",
  borderRadius: "7px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  textTransform: "capitalize",
};

const nonSelectedStyle = {
  border: "2px solid #11395C",
  color: "#11395C",
  borderRadius: "7px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  textTransform: "capitalize",
};

const StockBtnOptions = [
  { label: "Standalone", variant: "outlined" },
  { label: "Consolidated", variant: "outlined" },
];

// const rowHeaders = [
//   "Total ShareHolders Funds",
//   "Minority Interest Liability",
//   "Total Non Current Liabilities",
//   "Total Capital Liabilities",
//   "Fixed Assets",
//   "Total Non Current Assets",
//   "Total Current Assets",
//   "Total Assets",
//   "Contingent Liabilities plus Commitments",
//   "Bonus Equity Share Capital",
//   "Non Current Investments Unquoted BookValue",
// ];

const CashFlowTable = ({ annualDataDump }: any) => {
  const [selectedButton, setSelectedButton] = useState<string>("Standalone");
  const [financialData, setFinancialData] = useState<any>({});
  const [years, setYears] = useState<string[]>([]);
  const [financialKeys, setFinancialKeys] = useState<string[]>([]);

  useEffect(() => {
    if (annualDataDump?.standalone && annualDataDump?.consolidated) {
      const selectedData =
        selectedButton === "Standalone"
          ? annualDataDump.standalone
          : annualDataDump.consolidated;

      if (selectedData) {
        const extractedYears = Object.keys(selectedData); // Extract years dynamically
        setYears(extractedYears);

        const extractedKeys = Object.keys(selectedData[extractedYears[0]]); // Extract financial keys
        setFinancialKeys(extractedKeys);
        setFinancialData(selectedData); // Store all data
      }
    }
  }, [selectedButton, annualDataDump]);

  return (
    <TableContainer
      component={Paper}
      style={{
        borderRadius: "23px",
        marginTop: "2rem",
        maxHeight: "70vh", // Restrict table height
        overflowY: "auto", // Enable scrolling
      }}
    >
      <div style={{ marginLeft: "1rem", marginTop: "1rem" }}>
        <ButtonGroup
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
          selectedStyle={selectedStyle}
          nonSelectedStyle={nonSelectedStyle}
          StockBtnOptions={StockBtnOptions}
          customClass={true}
        />
      </div>
      <Table>
        {/* Table Header */}
        <TableHead>
          <TableRow>
            <TableCell>Particulars (in Crs.)</TableCell>
            {years.map((year) => (
              <TableCell key={year}>{year}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {financialKeys.map((key) => (
            <TableRow key={key}>
              <TableCell>{key.replace(/_A$/, "")}</TableCell>
              {years.map((year) => (
                <TableCell key={year}>
                  {financialData[year]?.[key] ?? "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {/* <TableBody>
          {rowHeaders.map((rowHeader) => (
            <TableRow key={rowHeader}>
              <TableCell>{rowHeader}</TableCell>
              {years.map((year) => (
                <TableCell key={year}>
                  {financialKeys.includes(rowHeader)
                    ? financialData[year]?.[rowHeader] ?? "-"
                    : "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody> */}
      </Table>
    </TableContainer>
  );
};

export default CashFlowTable;
