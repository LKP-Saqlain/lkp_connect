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

const AnnualDynamicTable = ({ annualOrder, annualDataDump }: any) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [parameters, setParameters] = useState<string[]>([]);

  useEffect(() => {
    if (!annualOrder || !annualDataDump) return;

    // Extract parameter keys from annualDataDump (rows)
    const parameterKeys = Object.keys(annualDataDump);
    setParameters(parameterKeys);
    console.log(parameters);

    // Prepare table data
    const formattedData = parameterKeys.map((param) => {
      let rowData: any = { parameter: param };

      // Map annualOrder (columns) to respective data
      annualOrder.forEach((year: any) => {
        rowData[year] = annualDataDump[param]?.[year] ?? "-"; // Add dash if data is missing
      });

      return rowData;
    });

    setTableData(formattedData);
  }, [annualOrder, annualDataDump]);

  if (!tableData.length) {
    return (
      <p style={{ textAlign: "center", padding: "1rem" }}>No data available</p>
    );
  }

  return (
    <TableContainer
      component={Paper}
      style={{ borderRadius: "10px", marginTop: "1rem" }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Parameter</TableCell>
            {annualOrder.map((year: any, index: any) => (
              <TableCell key={index} style={{ fontWeight: "bold" }}>
                {year}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>{row.parameter}</TableCell>
              {annualOrder.map((year: any, index: any) => (
                <TableCell key={index}>{row[year]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnnualDynamicTable;
