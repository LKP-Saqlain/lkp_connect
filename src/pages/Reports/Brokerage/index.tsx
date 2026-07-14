import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { Card, CardBody, CardHeader } from "reactstrap";
import { DateRangePicker } from "rsuite";
import { apiServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import DataTable from "../../../components/common/UserInfoTable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";

const BrokerageData = ({ activeSubItem }: any) => {
  const [formData, setFormData] = useState({
    reportType: "ClientWise",
    branchCode: "",
    zone: "",
    dateRange: null as [Date, Date] | null,
    clientCode: "",
  });
  const [zoneOptions, setZoneOptions] = useState<any[]>([]);
  const [branchCodeOptions, setBranchCodeOptions] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const { allowedMaxDays, afterToday, combine } = DateRangePicker;
  const dispatch = useDispatch<AppDispatch>();
  const { user_id, user_type } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    const fetchZones = async () => {
      const payload = {
        // user_id: "EMP-0040",
        user_id: user_id,
        option: "zone",
        userType: user_type === "Employee" ? "EMP" : "APN",
        zone: selectedZone?.value,
      };

      try {
        const res = await apiServices.getDropDown(payload);

        if (res?.status === 200) {
          const zones = res.data.data.map((item: any) => ({
            label: item.desc,
            value: item.val,
          }));

          setZoneOptions(zones);

          // Auto select first zone
          if (!selectedZone && zones.length > 0) {
            setSelectedZone(zones[0]);

            setFormData((prev) => ({
              ...prev,
              zone: zones[0].value,
            }));
          }
        }
      } catch (error) {
        console.error("Zone API Error", error);
      }
    };

    fetchZones();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      if (!selectedZone?.value) return;

      const payload = {
        // user_id: Id,
        user_id: user_id,
        option: "BranchByZone",
        userType: user_type === "Employee" ? "EMP" : "APN",
        zone: selectedZone.value,
      };

      try {
        const res = await apiServices.getDropDown(payload);

        if (res?.status === 200) {
          const branches = [
            // {
            //   label: "ALL",
            //   value: "ALL",
            // },
            ...res.data.data.map((item: any) => ({
              label: item.val,
              value: item.val,
            })),
          ];

          setBranchCodeOptions(branches);

          setFormData((prev) => ({
            ...prev,
            branchCode: "",
          }));
        }
      } catch (error) {
        console.error("Branch API Error", error);
      }
    };

    fetchBranches();
  }, [selectedZone]);

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    // Validation
    if (!formData.reportType) {
      alert("Please select Report Type.");
      return;
    }
    if (!formData.dateRange || formData.dateRange.length !== 2) {
      alert("Please select Date Range.");
      return;
    }

    if (
      (formData.reportType === "ClientWise" ||
        formData.reportType === "BranchWise") &&
      !formData.zone
    ) {
      alert("Zone is mandatory.");
      return;
    }

    if (formData.reportType === "DateWise" && !formData.clientCode.trim()) {
      alert("Client Code is mandatory.");
      return;
    }

    const payload = {
      firstDate: formData.dateRange[0].toISOString().split("T")[0],
      lastDate: formData.dateRange[1].toISOString().split("T")[0],
      zone: formData.zone,
      branchCode: formData.branchCode,
      clientCode: formData.clientCode,
      reportType: formData.reportType,
      userID: user_id, // Replace with logged-in user ID
    };
    handleReportData(payload);
    console.log("payload:", payload);
  };

  const handleReportData = async (payload: any) => {
    dispatch(showLoader("Fetching Details..."));

    try {
      const response = await apiServices.GetBrokerageReport(payload);
      console.log("response ZonelData", response?.data);
      const filteredData = (response?.data || []).map(
        (item: any, i: number) => ({ id: i + 1, ...item }),
      );
      console.log("response ZonelData filtered", filteredData[0]);

      setData(filteredData);
      // setData(response?.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  //   const handleReset = () => {
  //     setFormData({
  //       reportType: "clientwise",
  //       branchCode: "",
  //       zone: "",
  //       dateRange: null,
  //       clientCode: "",
  //     });
  //   };

  const handleExportExcel = () => {
    if (!data.length) {
      alert("No data available.");
      return;
    }

    let exportData: any[] = [];

    switch (formData.reportType) {
      case "ClientWise":
        exportData = data.map((row) => ({
          Branch: row.branchCode,
          "Branch Type": row.branchType,
          "Client Code": row.clientCode,
          "Client Name": row.clientName,
          "EQ Brokerage": row.eQ_Brok,
          "F&O Brokerage": row.fnO_Brok,
          "Commodity Brokerage": row.comm_Brok,
          "SLBM Brokerage": row.slbM_Brok,
          "Total Brokerage": row.total_Brok,
          "AP Sharing Brokerage": row.apSharing_Brok,
          "LKP Share": row.neT_To_LKP_Brok,
        }));
        break;

      case "BranchWise":
        exportData = data.map((row) => ({
          Branch: row.branchCode,
          "Branch Type": row.branchType,
          "Branch Name": row.branchName,
          "EQ Brokerage": row.eQ_Brok,
          "F&O Brokerage": row.fnO_Brok,
          "Commodity Brokerage": row.comm_Brok,
          "SLBM Brokerage": row.slbM_Brok,
          "Total Brokerage": row.total_Brok,
          "AP Sharing Brokerage": row.apSharing_Brok,
          "LKP Share": row.neT_To_LKP_Brok,
        }));
        break;

      case "DateWise":
        exportData = data.map((row) => ({
          "Trade Date": row.tradeDate,
          Branch: row.branchCode,
          "Branch Type": row.branchType,
          "Client Code": row.clientCode,
          "Client Name": row.clientName,
          "EQ Brokerage": row.eQ_Brok,
          "F&O Brokerage": row.fnO_Brok,
          "Commodity Brokerage": row.comm_Brok,
          "SLBM Brokerage": row.slbM_Brok,
          "Total Brokerage": row.total_Brok,
          "AP Sharing Brokerage": row.apSharing_Brok,
          "LKP Share": row.neT_To_LKP_Brok,
        }));
        break;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, formData.reportType);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${formData.reportType}_Brokerage_Report.xlsx`);
  };

  return (
    <div className="page-content page-view">
      <Card
        style={{
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <CardHeader
          style={{
            borderRadius: "15px 15px 0 0",
            background: "#fff",
            padding: "0.6rem 1rem",
          }}
        >
          <h4 className="card-title mb-0">Brokerage Details</h4>
        </CardHeader>

        <CardBody>
          <Box sx={{ my: 2 }}>
            {/* Report Type Row */}
            <Grid container spacing={2} alignItems="center">
              <Grid sx={{ pl: 2 }}>
                <FormControl>
                  <RadioGroup
                    row
                    name="reportType"
                    value={formData.reportType}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="ClientWise"
                      control={<Radio size="small" />}
                      label="Client Wise"
                    />

                    <FormControlLabel
                      value="DateWise"
                      control={<Radio size="small" />}
                      label="Date Wise"
                    />

                    <FormControlLabel
                      value="BranchWise"
                      control={<Radio size="small" />}
                      label="Branch Wise"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            {/* Input Row */}
            <Grid container spacing={2} alignItems="center">
              {/* Zone */}
              <Grid item>
                <TextField
                  select
                  size="small"
                  required={
                    formData.reportType === "ClientWise" ||
                    formData.reportType === "BranchWise"
                  }
                  label="Zone"
                  name="zone"
                  value={formData.zone}
                  onChange={(e) => {
                    handleChange(e);

                    const selected = zoneOptions.find(
                      (item) => item.value === e.target.value,
                    );

                    setSelectedZone(selected);
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 36,
                      fontSize: 13,
                      width: 200,
                    },
                  }}
                >
                  {zoneOptions.map((zone) => (
                    <MenuItem key={zone.value} value={zone.value}>
                      {zone.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item>
                <TextField
                  select
                  size="small"
                  label="Branch"
                  name="branchCode"
                  value={formData.branchCode}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 36,
                      fontSize: 13,
                      width: 200,
                    },
                  }}
                >
                  {branchCodeOptions.map((branch) => (
                    <MenuItem key={branch.value} value={branch.value}>
                      {branch.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/* Date Range */}
              <Grid item>
                <Grid item>
                  <DateRangePicker
                    value={formData.dateRange}
                    onChange={(value) => {
                      setFormData({
                        ...formData,
                        dateRange: value as [Date, Date] | null,
                      });
                    }}
                    format="dd/MM/yyyy"
                    placeholder="Select Date Range"
                    cleanable
                    oneTap={false}
                    shouldDisableDate={combine(
                      allowedMaxDays(365), // Maximum range of 365 days
                      afterToday(), // Disables future dates
                    )}
                    style={{
                      width: 230,
                      height: 36,
                    }}
                  />
                </Grid>
              </Grid>

              {/* Client Code */}
              <Grid item>
                <TextField
                  required={formData.reportType === "DateWise"}
                  size="small"
                  label="Client Code"
                  name="clientCode"
                  value={formData.clientCode}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-root": {
                      height: 36,
                      fontSize: 13,
                      width: 150,
                    },
                  }}
                />
              </Grid>

              {/* Search */}
              <Grid item>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSearch}
                  sx={{
                    height: 34,
                    color: "#fff",
                    backgroundColor: "#11395c",
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<DownloadIcon fontSize="small" />}
                  onClick={handleExportExcel}
                  sx={{
                    height: 34,
                    ml: 1,
                    color: "#fff",
                    backgroundColor: "#11395c",
                    textTransform: "none",
                  }}
                >
                  Excel
                </Button>
              </Grid>
            </Grid>
          </Box>
          <DataTable
            T6Data={data}
            activeSubItem={activeSubItem}
            tabValue={formData.reportType}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default BrokerageData;
