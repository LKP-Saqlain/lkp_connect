import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const directStyle = {
  bgcolor: "#A8D4FB",
  color: "#000",
  border: "none",
  borderRadius: "5px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  textTransform: "capitalize",
};

export const indirectStyle = {
  bgcolor: "#FFAE69",
  color: "#000",
  border: "none",
  borderRadius: "5px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  textTransform: "capitalize",
};

export const CombinedStyles = {
  background: "linear-gradient(to right, #A8D4FB 30%, #FFAE69 83%)",
  color: "#000",
  border: "none",
  borderRadius: "5px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  textTransform: "capitalize",
};

// utils/formatters.js
export const capitalizeEachWord = (text: any) => {
  if (!text || typeof text !== "string") return "";

  return text
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const exportToExcel = (
  data: any[],
  columns: { headerName: string; field: string }[],
  fileName: string
) => {
  const formattedData = data.map((row) => {
    const obj: any = {};
    columns.forEach((col: any) => {
      if (col?.headerName && col?.field) {
        obj[col.headerName] = row[col.field] ?? "";
      }
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `${fileName}.xlsx`);
};
