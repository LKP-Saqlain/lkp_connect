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

const DynamicTable = ({ fundamentalShareHolding }: any) => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [quarters, setQuarters] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!fundamentalShareHolding?.chartData) return;

    const data = fundamentalShareHolding.chartData;

    //getting extracted headers from api
    const categoryKeys = Object.keys(data);
    console.log("categoryKeys", categoryKeys);
    setCategories(categoryKeys);

    // Extract quarters here
    const firstCategory = categoryKeys[0];
    const extractedQuarters = data[firstCategory]
      .slice(1)
      .map((row: any) => row[0]);
    console.log("quarters", extractedQuarters);

    setQuarters(extractedQuarters);
    console.log(quarters);

    // Prepare table data by mapping quarters to their respective holdings
    const formattedData = extractedQuarters.map((quarter: any, index: any) => {
      let rowData: any = { quarter };
      categoryKeys.forEach((category) => {
        const value = data[category][index + 1]?.[1];
        rowData[category] = value === 0 ? "0" : value ? `${value}` : "N/A";
      });
      return rowData;
    });

    setTableData(formattedData);
  }, [fundamentalShareHolding]);

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
            <TableCell style={{ fontWeight: "bold" }}>Quarter</TableCell>
            {categories.map((category, index) => (
              <TableCell key={index} style={{ fontWeight: "bold" }}>
                {category}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell>{row.quarter}</TableCell>
              {categories.map((category, index) => (
                <TableCell key={index}>{row[category]}%</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
