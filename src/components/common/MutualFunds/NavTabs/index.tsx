import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { BasicTabsProps } from "../../../../pages/MutualFund/mfTypes";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({
  tabs = [],
  heading,
  value,
  onChange,
  returnPeriods = [],
  selectedReturnPeriod,
  onReturnPeriodChange,
  customCase,
  onSearchClick,
}: BasicTabsProps & {
  value: number;
  onChange: (event: React.SyntheticEvent, value: number) => void;
  returnPeriods?: { label: string; value: string }[]; // ✅ new prop
  selectedReturnPeriod?: string;
  onReturnPeriodChange?: (value: string) => void;
}) {
  return (
    <Box sx={{ width: "100%" }}>
      {heading && (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>{heading}</span>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // ✅ Tabs left, filters right
          alignItems: "center",
          mt: 1,
        }}
      >
        {/* Left Side Tabs */}
        <Tabs
          value={value}
          onChange={onChange}
          aria-label="tabs"
          sx={{ minHeight: "36px" }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              {...a11yProps(index)}
              style={{ fontSize: "12px", color: "#666666" }}
            />
          ))}{" "}
          {customCase === "Search" && (
            <Button
              onClick={onSearchClick}
              sx={{ color: "#666666", fontSize: "12px" }}
            >
              <SearchRoundedIcon /> Search
            </Button>
          )}
        </Tabs>

        {/* Right Side Time Filters */}
        {returnPeriods.length > 0 && (
          <Box sx={{ display: "flex", gap: 1 }}>
            {returnPeriods.map((period) => (
              <Button
                key={period.value}
                variant={
                  selectedReturnPeriod === period.label
                    ? "contained"
                    : "outlined"
                }
                size="small"
                sx={{
                  backgroundColor:
                    selectedReturnPeriod === period.label
                      ? "#004aad"
                      : "outlined",
                  textTransform: "none",
                  borderRadius: "20px",
                  fontSize: "11px",
                  padding: "2px",
                }}
                onClick={() => {
                  onReturnPeriodChange?.(period.label);
                  console.log(
                    period.value,
                    period,
                    onReturnPeriodChange,
                    "onReturnPeriodChange",
                    selectedReturnPeriod
                  );
                }}
              >
                {period.label}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
