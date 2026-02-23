import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";
import { Tabs, Tab } from "@mui/material";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const InvoiceMail = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [dropdownData, setDropdownData] = useState<any[]>([]);
  const [flag, setFlag] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState<string>("Single Mail");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const mailTabs = ["Single Mail", "Bulk Mail"];

  // Optimized useEffect
  useEffect(() => {
    const fetchData = async () => {
      dispatch(showLoader("Please wait, we are processing your request..."));
      try {
        if (tabValue === "Single Mail") {
          const response = await apiServices.GetReadyToSendTPInvoices({
            user_id,
          });
          const apiData = response?.data?.data || [];
          const updatedData = apiData.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));
          setData(updatedData);
        } else if (tabValue === "Bulk Mail") {
          setSelectedTemplate("");
          const response = await apiServices.ThirdPartyInvoiceDropdown({
            user_id,
          });
          setDropdownData(response?.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchData();
  }, [tabValue, user_id, dispatch, flag]);

  // Download PDF
  const handleDownload = async (value: any) => {
    try {
      dispatch(showLoader("Please wait, we are processing your request..."));
      const response: any = await apiServices.GenerateTPInvoice({
        user_id,
        rowId: value.rid,
      });

      const blob = new Blob([response?.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `TP_Invoice_${value.invn}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  // Single email send
  const handleSendEmail = async () => {
    if (!selectedRows.length) return;

    try {
      dispatch(showLoader("Please wait, we are processing your request..."));
      const response = await apiServices.SendTPInvoiceBulkEmail({
        user_id,
        invoiceList: selectedRows,
      });

      if (response?.data?.statusCode === 200) {
        setFlag(!flag); // Trigger refresh
        ShowToast("success", response?.data?.msg);
      } else {
        ShowToast("error", response?.data?.msg);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  // Bulk email send
  const handleBulkSendEmail = async () => {
    if (!selectedTemplate) return;

    try {
      dispatch(showLoader("Please wait, we are processing your request..."));
      const payload = { user_id, ledgerCode: selectedTemplate, partyName: "" };
      const response = await apiServices.SendCompanyWiseTPInvoiceMail(payload);

      if (response?.data?.statusCode === 200) {
        ShowToast("success", response?.data?.message);
      } else {
        ShowToast("error", response?.data?.message);
      }
    } catch (error) {
      console.error("Error sending bulk email:", error);
    } finally {
      dispatch(hideLoader());
      setSelectedTemplate("");
      // Refresh dropdown after sending
      try {
        const res = await apiServices.ThirdPartyInvoiceDropdown({ user_id });
        setDropdownData(res?.data?.data || []);
      } catch (err) {
        console.error("Error refreshing dropdown:", err);
      }
    }
  };

  // Row selection
  const handleRowSelectionChange = (newSelection: any) => {
    if (Array.isArray(newSelection)) {
      const validSelections = newSelection.filter(
        (id) => typeof id === "string" || typeof id === "number"
      );
      setSelectedRows(validSelections);
    } else {
      setSelectedRows([]);
    }
  };

  const isSendEmailDisabled = !selectedRows.length;

  return (
    <div className="page-content page-view">
      <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          marginTop: "1rem",
          marginLeft: ".7rem",
          marginBottom: "8px",
          backgroundColor: "white",
          borderRadius: "11px",
          width: "fit-content",
          minHeight: 0,
        }}
      >
        {mailTabs.map((label) => (
          <Tab
            key={label}
            value={label}
            label={label}
            disableRipple
            sx={{
              textTransform: "none",
              fontWeight: 400,
              borderRadius: "10px",
              px: 3,
              minHeight: 10,
              backgroundColor: tabValue === label ? "#11395C" : "white",
              color: tabValue === label ? "white" : "#11395C",
              "&.Mui-selected": { color: "white !important" },
              "& .MuiTab-wrapper": {
                color: tabValue === label ? "white" : "#11395C",
              },
            }}
          />
        ))}
      </Tabs>

      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">Third Party Invoice Mail</h4>
          </CardHeader>

          <CardBody>
            {tabValue === "Single Mail" && (
              <>
                <DataTable
                  activeSubItem={activeSubItem}
                  T6Data={data}
                  handleDownload={handleDownload}
                  checkboxSelection
                  disableRowSelectionOnClick={false}
                  onRowSelectionModelChange={handleRowSelectionChange}
                />
                <div style={{ marginTop: ".2rem" }}>
                  <Button
                    onClick={handleSendEmail}
                    disabled={isSendEmailDisabled}
                    style={{
                      backgroundColor: "#11395C",
                      color: "#fff",
                      // padding: "4px 10px",
                      opacity: isSendEmailDisabled ? 0.6 : 1,
                      cursor: isSendEmailDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    Send Email
                  </Button>
                </div>
              </>
            )}

            {tabValue === "Bulk Mail" && (
              <Box display="flex" gap={2} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 500 }}>
                  <InputLabel id="party-name-label">
                    Select Party Name
                  </InputLabel>
                  <Select
                    labelId="party-name-label"
                    value={selectedTemplate}
                    label="Select Party Name"
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    {dropdownData?.map((item: any) => (
                      <MenuItem key={item.ldc} value={item.ldc}>
                        {item.pnm}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleBulkSendEmail}
                  disabled={!selectedTemplate}
                  style={{
                    backgroundColor: "#11395C",
                    color: "#fff",
                  }}
                >
                  Send Mail
                </Button>
              </Box>
            )}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default InvoiceMail;
