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
    setHeader(CorporateData.tableHeaders || []);
    setData(CorporateData[name] || []);
    console.log(header, "tableheadername", data, name);
  }, [CorporateData, name]);

  const columnCount = header.length + 1;
  const columnWidth = `${100 / columnCount}%`;

  const cellStyle = {
    padding: "4px 8px",
    height: "30px",
    fontSize: "14px",
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "50vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                style={{ ...cellStyle, fontWeight: "bold", width: columnWidth }}
              >
                Sr. No
              </TableCell>
              {header &&
                header.map((headerItem, index) => (
                  <TableCell
                    align="left"
                    key={index}
                    style={{
                      ...cellStyle,
                      fontWeight: "bold",
                      width: columnWidth,
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
                  <TableCell
                    align="center"
                    sx={{ ...cellStyle, width: columnWidth }}
                  >
                    {rowIndex + 1}
                  </TableCell>
                  {row.map((cell: any, cellIndex: any) => (
                    <TableCell
                      align="left"
                      key={cellIndex}
                      sx={{ ...cellStyle, width: columnWidth }}
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
