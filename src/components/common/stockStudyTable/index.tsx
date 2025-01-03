import React, { useState } from "react";
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
import "./style.css";
import ButtonGroup from "../../common/ButtonGroup";

const data = [
  {
    title: "Operatin Profit Margin %",
    cagr3Yrs: "9.1%",
    cagr5Yrs: "10.3%",
    years: ["118,192.7", "112,169.4", "108,038.8", "106,912.5", "98,083.8"],
    isSubpoint: false,
  },
  {
    title: "Cash from Operating Activity",
    cagr3Yrs: "6.8%",
    cagr5Yrs: "6.8%",
    years: ["118,192.7", "112,169.4", "108,038.8", "106,912.5", "98,083.8"],
    isSubpoint: false,
  },
  {
    title: "- Profit Before Tax",
    cagr3Yrs: "8.9%",
    cagr5Yrs: "8.5%",
    years: ["118,192.7", "112,169.4", "108,038.8", "106,912.5", "98,083.8"],
    isSubpoint: true,
    parent: "Cash from Operating Activity",
  },
  {
    title: "- Interest",
    cagr3Yrs: "-6.8%",
    cagr5Yrs: "-3.9%",
    years: ["118,192.7", "112,169.4", "108,038.8", "106,912.5", "98,083.8"],
    isSubpoint: true,
    parent: "Cash from Operating Activity",
  },
  {
    title: "- Tax",
    cagr3Yrs: "-6.8%",
    cagr5Yrs: "-6.9%",
    years: ["118,192.7", "112,169.4", "108,038.8", "106,912.5", "98,083.8"],
    isSubpoint: true,
    parent: "Cash from Operating Activity",
  },
  {
    title: "Cash from Investing Activity",
    cagr3Yrs: "9.1%",
    cagr5Yrs: "10.3%",
    years: [
      "118,192.7435",
      "112,169.4434",
      "108,038.843",
      "106,912.543",
      "98,083.834",
    ],
    isSubpoint: false,
  },
];

const selectedStyle = {
  bgcolor: "#11395C",
  color: "#fff",
  borderRadius: "7px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  textTransform: "capitalize",
};

const nonSelectedStyle = {
  // bgcolor: "#ABC4DA",
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

const CashFlowTable = () => {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [selectedButton, setSelectedButton] = useState<string>("Standalone");

  const handleToggleRow = (title: string) => {
    if (expandedRows.includes(title)) {
      setExpandedRows(expandedRows.filter((row) => row !== title));
    } else {
      setExpandedRows([...expandedRows, title]);
    }
  };

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ borderRadius: "23px", marginTop: "2rem" }}
      >
        <Table>
          <TableHead>
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
            <TableRow>
              <TableCell>Particulars (in Crs.)</TableCell>
              <TableCell>CAGR 3 Yrs</TableCell>
              <TableCell>CAGR 5 Yrs</TableCell>
              <TableCell>Mar '23</TableCell>
              <TableCell>Mar '22</TableCell>
              <TableCell>Mar '21</TableCell>
              <TableCell>Mar '20</TableCell>
              <TableCell>Mar '19</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const isParent = data.some((d) => d.parent === row.title);
              const isExpanded = expandedRows.includes(row.title);

              if (!row.isSubpoint) {
                // Render parent rows
                return (
                  <React.Fragment key={row.title}>
                    <TableRow>
                      <TableCell
                        style={{
                          paddingLeft: "1rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {row.title}
                        {isParent && (
                          <IconButton
                            size="small"
                            onClick={() => handleToggleRow(row.title)}
                          >
                            {isExpanded ? (
                              <KeyboardArrowUp />
                            ) : (
                              <KeyboardArrowDown />
                            )}
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell
                        style={{
                          color:
                            row.title === "Cash from Operating Activity"
                              ? "#01D28E"
                              : "inherit",
                        }}
                      >
                        {" "}
                        {row.cagr3Yrs}
                      </TableCell>
                      <TableCell
                        style={{
                          color:
                            row.title === "Cash from Operating Activity"
                              ? "#01D28E"
                              : "inherit",
                        }}
                      >
                        {row.cagr5Yrs}
                      </TableCell>
                      {row.years.map((value, idx) => (
                        <TableCell key={idx}>{value}</TableCell>
                      ))}
                    </TableRow>

                    {/* Render subpoints for expanded parent rows */}
                    {isExpanded &&
                      data
                        .filter(
                          (subRow) =>
                            subRow.isSubpoint && subRow.parent === row.title
                        )
                        .map((subRow) => (
                          <TableRow
                            key={subRow.title}
                            style={{ backgroundColor: "#f9f9f9" }}
                          >
                            <TableCell style={{ paddingLeft: "3rem" }}>
                              {subRow.title}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  subRow.parent ===
                                  "Cash from Operating Activity"
                                    ? "#01D28E"
                                    : "inherit",
                              }}
                            >
                              {subRow.cagr3Yrs}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  subRow.parent ===
                                  "Cash from Operating Activity"
                                    ? "#01D28E"
                                    : "inherit",
                              }}
                            >
                              {subRow.cagr5Yrs}
                            </TableCell>
                            {subRow.years.map((value, idx) => {
                              // Add underline for specific years
                              const yearsToUnderline = [0, 2, 4]; // Indexes for 'Mar 23', 'Mar 21', 'Mar 19'
                              const underlineStyle: React.CSSProperties =
                                yearsToUnderline.includes(idx)
                                  ? {
                                      // position: "absolute",
                                      // borderBottom: "2px solid #FE4747", // Custom underline width
                                      // borderBottomWidth: "2px",
                                    }
                                  : {};

                              return (
                                <TableCell key={idx} style={underlineStyle}>
                                  {value}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                  </React.Fragment>
                );
              }

              return null; // Do not render subpoints directly
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CashFlowTable;
