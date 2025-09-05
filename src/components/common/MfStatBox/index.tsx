import { Typography } from "@mui/material";
import React from "react";

interface StatBoxProps {
  label: string;
  value: number | string;
  isCurrency?: boolean;
  isPercentage?: boolean;
  color?: string;
  bold?: boolean;
}

const StatBox: React.FC<StatBoxProps> = ({
  label,
  value,
  isCurrency = false,
  isPercentage = false,
  color,
  bold = true,
}) => {
  const formattedValue =
    value === null || value === undefined
      ? "-" // placeholder before API
      : isCurrency
      ? value.toLocaleString("en-IN", { style: "currency", currency: "INR" })
      : isPercentage
      ? `${value}       `
      : typeof value === "number"
      ? value.toLocaleString("en-IN")
      : value;

  return (
    <div>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={bold ? 600 : 400}
        color={color || "inherit"}
      >
        {formattedValue}
        {isPercentage && "%"}
      </Typography>
    </div>
  );
};

export default StatBox;
