import React, { useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { TradeCapsules } from "../../helper/tableColumns.tsx";
// import ButtonGroup from "../../components/common/BuutonGroup";
import { Select, MenuItem, FormControl } from "@mui/material";

const TradeCapsule = () => {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string;
  }>({});

  const handleChange = (id: number, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [id]: value }));
  };

  const getButtonLabels = (id: number) => {
    switch (id) {
      case 2:
        return [
          { value: "", label: "Please Select" },
          { value: "All", label: "All" },
          { value: "SPADE", label: "Spade" },
          { value: "ALPHA", label: "Alpha" },
          { value: "OTHER", label: "Other" },
        ];
      case 3:
      case 4:
      case 5:
        return [
          { value: "", label: "Please Select" },
          { value: "All", label: "All" },
          { value: "FUTURE", label: "Future" },
          { value: "OPTION", label: "Option" },
        ];
      default:
        return [];
    }
  };

  return (
    <React.Fragment>
      <Row className="capsule-custom d-flex flex-row justify-content-between align-items-center ms-1 mobile-margin">
        {(TradeCapsules || []).map((item, key) => (
          <Col lg={2} md={6} sm={12} key={key}>
            <Card
              className="capsule-hover"
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                height: item.id === 1 ? "80px" : "auto",
                borderRadius: "12px",
              }}
            >
              <CardBody>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="flex-grow-1 text cursor-pointer">
                    <p
                      className="fw-semibold fs-12 mb-1 trade-dash-txt text-center"
                      style={{
                        fontFamily: '"Public Sans", sans-serif',
                        marginTop: item.id === 1 ? "15px" : "auto",
                      }}
                    >
                      {item.label}
                    </p>
                    {item.id > 1 && (
                      <div className="d-flex justify-content-center w-100">
                        <FormControl
                          sx={{
                            minWidth: 100,
                            maxWidth: 120,
                            "& .MuiInputBase-root": {
                              height: 25,
                              backgroundColor: "white", // Ensure dropdown stays visible
                              borderRadius: "5px",
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "10px",
                            },
                            "& .MuiSelect-select": {
                              padding: "4px 8px",
                              fontSize: "12px",
                              backgroundColor: "white !important", // Override hover effect
                              color: "black !important", // Ensure text remains visible
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#ddd",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#ccc",
                            },
                          }}
                        >
                          {/* <InputLabel>Select Option</InputLabel> */}
                          <Select
                            value={selectedOptions[item.id] || ""}
                            onChange={(event: any) =>
                              handleChange(item.id, event.target.value)
                            }
                            className="placeholder-font"
                            displayEmpty
                          >
                            {getButtonLabels(item.id).map((option) => (
                              <MenuItem
                                key={option.value}
                                value={option.value}
                                sx={{
                                  fontFamily: '"Public Sans", sans-serif', // Apply font family to dropdown options
                                  fontSize: "12px",
                                }}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default TradeCapsule;
