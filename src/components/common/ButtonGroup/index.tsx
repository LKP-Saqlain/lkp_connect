import React from "react";
import { Button } from "@mui/material";

const buttonOptions = [
  { label: "7 Days", variant: "outlined" },
  { label: "15 Days", variant: "outlined" },
  { label: "1 Month", variant: "outlined" },
  { label: "3 Months", variant: "contained" },
  { label: "6 Months", variant: "contained" },
  { label: "12 Months", variant: "contained" },
];

const ButtonGroup = ({
  selectedButton,
  setSelectedButton,
  selectedStyle,
  nonSelectedStyle,
  StockBtnOptions,
  customClass,
}: {
  selectedButton: string;
  setSelectedButton: React.Dispatch<React.SetStateAction<string>>;
  selectedStyle: any;
  nonSelectedStyle: any;
  StockBtnOptions?: any;
  customClass?: any;
}) => {
  const renderBtn = customClass ? StockBtnOptions : buttonOptions;

  return (
    <div className="d-flex gap-1">
      {renderBtn &&
        renderBtn.map(({ label, variant }: any) => (
          <Button
            key={label}
            //   variant={variant}
            size="small"
            color={variant === "contained" ? "primary" : undefined}
            onClick={() => setSelectedButton(label)}
            sx={selectedButton === label ? selectedStyle : nonSelectedStyle}
          >
            {label}
          </Button>
        ))}
    </div>
  );
};

export default ButtonGroup;
