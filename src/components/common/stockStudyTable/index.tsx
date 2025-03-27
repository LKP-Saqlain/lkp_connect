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

const rowHeaders = [
  {
    title: "Total ShareHolders Funds",
    shortKey: "TotalShareHoldersFunds_A",
  },
  {
    title: "Minority Interest Liability",
    shortKey: "LiabilityMinorityInterest_A",
  },
  {
    title: "Total Non Current Liabilities",
    shortKey: "TotalNonCurrentLiabilities_A",
  },
  {
    title: "Total Capital Liabilities",
    shortKey: "CL_A",
  },
  {
    title: "Fixed Assets",
    shortKey: "FixedAssets_A",
  },
  {
    title: "Total Non Current Assets",
    shortKey: "TotalNonCurrentAssets_A",
  },
  {
    title: "Total Current Assets",
    shortKey: "CA_A",
  },
  {
    title: "Total Assets",
    shortKey: "TA_A",
  },
  {
    title: "Contingent Liabilities plus Commitments",
    shortKey: "ContingentLiabilities_A",
  },
  {
    title: "Bonus Equity Share Capital",
    shortKey: "",
  },
  {
    title: "Non Current Investments Unquoted BookValue",
    shortKey: "",
  },
  {
    title: "Current Investments Unquoted BookValue",
    shortKey: "",
  },
];

const CashFlowTable = ({ annualDataDump, isCustomRender }: any) => {
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

        const firstYearData = selectedData?.[extractedYears[0]] || {};
        const extractedKeys = Object.keys(firstYearData);
        setFinancialKeys(extractedKeys);
        setFinancialData(selectedData); // Store all data
        console.log("financialKeys", financialKeys);
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
          {isCustomRender &&
            rowHeaders.map(({ title, shortKey }) => (
              <TableRow key={title}>
                <TableCell>{title}</TableCell>
                {years.map((year) => (
                  <TableCell key={year}>
                    {shortKey
                      ? financialData[year]?.[shortKey]
                        ? new Intl.NumberFormat("en-IN").format(
                            financialData[year][shortKey]
                          )
                        : "-"
                      : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CashFlowTable;
