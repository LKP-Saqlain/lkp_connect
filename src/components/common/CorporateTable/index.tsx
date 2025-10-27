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

const CorporateTable = ({ CorporateData, name }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [header, setHeader] = useState<any[]>([]);

  // Setting headers and data from CorporateData
  useEffect(() => {
    console.log("corporateData", CorporateData);

    if (!CorporateData) return;

    setHeader(CorporateData.tableHeaders || []);

    const reversedData = (CorporateData[name] || []).map((row: any) => {
      return row.map((cell: any, index: number) => {
        // Format the first column as date
        if ((cell && index === 0) || index === 2 || (index === 3 && cell)) {
          return new Date(cell).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          });
        }
        // Format numeric columns (assuming second column is amount)
        if (index === 1 && typeof cell === "number") {
          return cell.toFixed(2);
        }
        return cell;
      });
    });

    setData(reversedData);
  }, [CorporateData, name]);

  const columnCount = header.length + 1;
  // const columnWidth = `${100 / columnCount}%`;

  const cellStyle = {
    padding: "4px 8px",
    height: "30px",
    fontSize: "14px",
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "50vh" }}>
        <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              {header &&
                header.map((headerItem, index) => (
                  <TableCell
                    align="center"
                    key={index}
                    style={{
                      ...cellStyle,
                      fontWeight: "bold",
                    }}
                  >
                    {headerItem.name}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {/* <TableCell align="center" sx={{ ...cellStyle }}>
                    {rowIndex + 1}
                  </TableCell> */}
                  {row.map((cell: any, cellIndex: any) => (
                    <TableCell
                      align="center"
                      key={cellIndex}
                      sx={{ ...cellStyle }}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount} align="center">
                  No data available !
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default CorporateTable;
