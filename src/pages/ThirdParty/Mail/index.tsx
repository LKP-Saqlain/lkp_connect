import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Container } from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import ShowToast from "../../../utils/toastUtils";

const InvoiceMail = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();
  const [flag, setFlag] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  useEffect(() => {
    const payload = {
      user_id: user_id,
    };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .GetReadyToSendTPInvoices(payload)
      .then((response) => {
        setData(response?.data?.data);
      })
      .catch((error) => {
        console.error("Error fetching compliance data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [dispatch, flag]);

  const handleDownload = (value: any) => {
    console.log(value, "generateValue");

    const payload = {
      user_id: user_id,
      rowId: value.rowId,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GenerateTPInvoice(payload)
      .then((response: any) => {
        // Expecting a blob response (PDF)
        const blob = new Blob([response?.data], { type: "application/pdf" });

        // Create a download URL
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = url;
        link.download = `TP_Invoice_${value.invoiceNumber}.pdf`; // name your file

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        // Show error notification if needed
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleSendEmail = () => {
    console.log("Selected rows for email:", selectedRows);
    const payload = {
      user_id: user_id,
      invoiceList: selectedRows,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .SendTPInvoiceBulkEmail(payload)
      .then((response) => {
        if (response?.data?.statusCode === 200) {
          setFlag(!flag);
          ShowToast("success", response?.data?.message);
        } else {
          ShowToast("error", response?.data?.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching compliance data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  const handleRowSelectionChange = (newSelection: any) => {
    // Ensure selection is a valid array of row IDs
    if (Array.isArray(newSelection)) {
      const validSelections = newSelection.filter(
        (id) => typeof id === "string" || typeof id === "number"
      );
      setSelectedRows(validSelections);
    } else {
      setSelectedRows([]);
    }
  };

  const isSendEmailDisabled =
    !Array.isArray(selectedRows) || selectedRows.length === 0;

  return (
    <div className="page-content page-view">
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
                  padding: "4px 10px",
                  opacity: isSendEmailDisabled ? 0.6 : 1,
                  cursor: isSendEmailDisabled ? "not-allowed" : "pointer",
                }}
              >
                Send Email
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default InvoiceMail;
