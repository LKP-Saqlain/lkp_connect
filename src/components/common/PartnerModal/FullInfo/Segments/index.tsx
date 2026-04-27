import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { SEGMENTS_DATA } from "../../../../../helper/commmon";
import { SelectableBox } from "../../StylingCss";

const formatCurrency = (value: number) => `₹ ${value?.toLocaleString("en-IN")}`;

const Segments = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;

  // Remove Summary Rows
  const selectedSegments = data.filter(
    (item) =>
      item.exchangeName !== "Stamp Paper charges" &&
      item.exchangeName !== "Total",
  );

  const totalRow = data.find((item) => item.exchangeName === "Total");

  const stampRow = data.find(
    (item) => item.exchangeName === "Stamp Paper charges",
  );

  // Check if segment is selected from API
  const isSelected = (exchange: string, label: string) => {
    return selectedSegments.some(
      (item) => item.exchangeName === exchange && item.segmentName === label,
    );
  };

  return (
    <Box>
      {/* ================= SELECT SEGMENT ================= */}
      <Typography fontSize={18} fontWeight={600} mb={2}>
        Select Segment
      </Typography>

      {SEGMENTS_DATA.map((section) => (
        <Box key={section.exchange} mb={3}>
          <Typography fontSize={14} fontWeight={600} mb={2}>
            {section.title}
          </Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            {section.items.map((item) => (
              <SelectableBox
                key={item.value}
                selected={isSelected(section.title, item.label)}
                label={
                  item.label === "Terminal" || item.label === "Without Terminal"
                    ? `${item.label} - ${formatCurrency(item.amount)}`
                    : `${item.label} - ${formatCurrency(item.amount)} + 18% GST`
                }
              />
            ))}
          </Box>
        </Box>
      ))}

      {/* ================= SUMMARY ================= */}
      <Box mt={3}>
        <Typography fontSize={18} fontWeight={600} mb={3}>
          Summary
        </Typography>

        <Table
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              border: "1px solid #e5e7eb",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Exchange</TableCell>
              <TableCell>Segments</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>GST (18%)</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {selectedSegments.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.exchangeName}</TableCell>
                <TableCell>{row.segmentName}</TableCell>
                <TableCell>{formatCurrency(row.amount)}</TableCell>
                <TableCell>{formatCurrency(row.gst)}</TableCell>
                <TableCell>{formatCurrency(row.total)}</TableCell>
              </TableRow>
            ))}

            {stampRow && (
              <TableRow>
                <TableCell colSpan={4}>{stampRow.exchangeName}</TableCell>
                <TableCell>{formatCurrency(stampRow.total)}</TableCell>
              </TableRow>
            )}

            {totalRow && (
              <TableRow>
                <TableCell colSpan={4} sx={{ fontWeight: 600 }}>
                  Total
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {formatCurrency(totalRow.total)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default Segments;
