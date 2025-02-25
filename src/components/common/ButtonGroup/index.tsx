import React from "react";
import { Button } from "@mui/material";
import { buttonOptions } from "../../../helper/tableColumns.tsx";

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
