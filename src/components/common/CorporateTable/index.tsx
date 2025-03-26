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
    console.log(header, "yeda", data, name);
  }, [CorporateData, name]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "50vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", width: "100px" }}
              >
                Sr. No
              </TableCell>
              {header &&
                header.map((headerItem, index) => (
                  <TableCell
                    align="left"
                    key={index}
                    style={{ fontWeight: "bold" }}
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
                  {/* Add Sr. No column for each row */}
                  <TableCell align="center">{rowIndex + 1}</TableCell>
                  {/* Render the actual data cells */}
                  {row.map((cell: any, cellIndex: any) => (
                    <TableCell align="left" key={cellIndex}>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={header.length + 1} align="center">
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
