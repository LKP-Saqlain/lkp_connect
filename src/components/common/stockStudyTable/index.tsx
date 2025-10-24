import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import ButtonGroup from "../../common/ButtonGroup";
import {
  CashFlowHeader,
  BalanceSheetHeader,
  FundamentalQuarterlyPNLHeader,
  FundamentalAnnualPNLHeader,
  FundamentalRatiosHeader,
} from "../../../helper/tableColumns";
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

const CashFlowTable = ({ annualDataDump, customHeaderType }: any) => {
  const [selectedButton, setSelectedButton] = useState<string>("Standalone");
  const [financialData, setFinancialData] = useState<any>({});
  const [years, setYears] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  useEffect(() => {
    console.log("Testtest", annualDataDump);

    if (annualDataDump?.standalone && annualDataDump?.consolidated) {
      const selectedData =
        selectedButton === "Standalone"
          ? annualDataDump.standalone
          : annualDataDump.consolidated;

      if (selectedData) {
        const extractedYears = Object.keys(selectedData).reverse();
        setYears(extractedYears);
        setFinancialData(selectedData);
      }
    }
  }, [selectedButton, annualDataDump]);

  const handleToggleRow = (title: string) => {
    setExpandedRows((prevExpanded) =>
      prevExpanded.includes(title)
        ? prevExpanded.filter((row) => row !== title)
        : [...prevExpanded, title]
    );
  };

  const headerMapping: { [key: string]: any } = {
    quarterlyPNL: FundamentalQuarterlyPNLHeader,
    annuallyPNL: FundamentalAnnualPNLHeader,
    cashFlow: CashFlowHeader,
    balanceSheet: BalanceSheetHeader,
    ratioHeader: FundamentalRatiosHeader,
  };
  const customHeaders = headerMapping[customHeaderType] || [];
  console.log("customHeaders", customHeaders);

  // const customHeaders =
  //   isQuarterlyHeader && !isCashFlowHeader
  //     ? FundamentalQuarterlyPNLHeader
  //     : isAnnuallyHeader && !isCashFlowHeader
  //     ? FundamentalAnnualPNLHeader
  //     : isCashFlowHeader
  //     ? CashFlowHeader
  //     : isBalanceSheetHeader
  //     ? BalanceSheetHeader
  //     : [];

  const sortedParents = Array.isArray(customHeaders)
    ? customHeaders
        .filter((item: any) => !item.isSubpoint)
        .sort((a: any, b: any) => (a.order ?? 100) - (b.order ?? 100))
    : [];

  return (
    <TableContainer
      component={Paper}
      style={{
        borderRadius: "23px",
        marginTop: "2rem",
        maxHeight: "70vh",
        overflowY: "auto",
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
        <TableHead>
          <TableRow>
            <TableCell>Particulars (in Crs.)</TableCell>
            {years.map((year) => (
              <TableCell key={year} align="right">
                {year}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {/* Balance Sheet Data */}
          {/* {isBalanceSheetHeader &&
            BalanceSheetHeader.map(({ title, shortKey }) => (
              <TableRow key={title}>
                <TableCell>{title}</TableCell>
                {years.map((year) => (
                  <TableCell key={year} align="right">
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
            ))} */}

          {/* Cash Flow / Quarterly PNL Data */}
          {customHeaders &&
            sortedParents.map((parent: any) => {
              const hasSubpoints = customHeaders.some(
                (item: any) => item.parent && item.parent === parent.title
              );
              const isExpanded = expandedRows.includes(parent.title);

              return (
                <React.Fragment key={parent.shortKey}>
                  {/* Parent Row */}
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold", paddingLeft: "1rem" }}
                    >
                      {parent.title}
                      {hasSubpoints && (
                        <IconButton
                          size="small"
                          onClick={() => handleToggleRow(parent.title)}
                        >
                          {isExpanded ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      )}
                    </TableCell>
                    {years.map((year) => (
                      <TableCell key={year} align="right">
                        {parent.shortKey
                          ? financialData[year]?.[parent.shortKey]
                            ? new Intl.NumberFormat("en-IN").format(
                                financialData[year][parent.shortKey]
                              )
                            : "-"
                          : "-"}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Subpoints (if expanded) */}
                  {isExpanded &&
                    customHeaders
                      .filter((sub: any) => sub.parent === parent.title)
                      .map((subRow: any) => (
                        <TableRow
                          key={subRow.shortKey}
                          style={{ backgroundColor: "#f9f9f9" }}
                        >
                          <TableCell style={{ paddingLeft: "3rem" }}>
                            {subRow.title}
                          </TableCell>
                          {years.map((year) => (
                            <TableCell key={year} align="right">
                              {subRow.shortKey
                                ? financialData[year]?.[subRow.shortKey]
                                  ? new Intl.NumberFormat("en-IN").format(
                                      financialData[year][subRow.shortKey]
                                    )
                                  : "-"
                                : "-"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                </React.Fragment>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CashFlowTable;
