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

  useEffect(() => {
    if (!fundamentalShareHolding?.chartData) return;

    const data = fundamentalShareHolding.chartData;
    console.log("ShareHoldingChartData", data);

    // Exclude "Institutional" and "MF"
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => key !== "Institutional" && key !== "MF"
      )
    ) as Record<string, any[]>;

    const firstCategory = Object.keys(filteredData)[0];
    if (!firstCategory || !filteredData[firstCategory]) return;

    // Assert that filteredData[firstCategory] is an array
    const extractedQuarters = (filteredData[firstCategory] as any[])
      .slice(1)
      .map((row: any) => row[0]);

    console.log("quarters", extractedQuarters);
    setQuarters(extractedQuarters);

    // Prepare table data
    const formattedData = Object.entries(filteredData).map(
      ([category, values]: [string, any[]]) => {
        const holdings = values.slice(1).map((row: any) => row[1]);
        return { category, holdings };
      }
    );

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
            <TableCell style={{ fontWeight: "bold" }}>Summary</TableCell>
            {quarters.map((quarter, index) => (
              <TableCell key={index} style={{ fontWeight: "bold" }}>
                {quarter}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell style={{ fontWeight: "bold" }}>
                {row.category}
              </TableCell>
              {row.holdings.map((holding: any, index: number) => (
                <TableCell key={index}>{holding}%</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
