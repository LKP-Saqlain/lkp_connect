import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import ModalComponent from "../../components/common/masterModal";
import { Box, TextField } from "@mui/material";
import UserInfoTable from "../../components/common/UserInfoTable";
import { useEffect, useState } from "react";
import Select from "react-select"; // Assuming you're using react-select
import { TypeOfExclusionClient } from "../../helper/tableColumns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import ShowToast from "../../utils/toastUtils";

type SelectOption = {
  value: string;
  label: string;
};

const Index = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState(false);

  const [clientCode, setClientCode] = useState("");
  const [excludeOptions, setExcludeOptions] = useState([]);
  const [data, setdata] = useState<any[]>([]);
  const [selectedApiOption, setSelectedApiOption] =
    useState<SelectOption | null>(null);
  const [selectedType, setSelectedType] = useState<SelectOption | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const toggleModal = () => setmodal_grid(!modal_grid);

  useEffect(() => {
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .GetExcludeOptions({})
      .then((res) => {
        if (res?.status === 200) {
          const formatted = res?.data?.data.map((item: any) => ({
            value: item.valueItem,
            label: item.displayItem,
          }));
          setExcludeOptions(formatted);
          console.log("Formatted Zone Options:", formatted);
        }
      })
      .catch(() => console.log("Error while fetching exclude options"))
      .finally(() => dispatch(hideLoader()));
  }, [dispatch, user_id]);

  const handleView = () => {
    if (!selectedApiOption) {
      ShowToast("error", "Please select a value for Exclude From");
      return;
    }
    const payload = {
      user_id: user_id,
      excludeFrom: selectedApiOption?.value,
      entryType: selectedType?.value || "ALL",
      code: clientCode || "ALL",
    };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .GetClientExclusionList(payload)
      .then((response) => {
        if (response?.status === 200) {
          setdata(response?.data?.data);
        }
      })
      .catch(() => console.log("Error while fetching exclude options"))
      .finally(() => dispatch(hideLoader()));
  };
  useEffect(() => {
    if (refreshTrigger) {
      handleView();
    }
  }, [refreshTrigger]);

  const handleFormSubmit = (values: any) => {
    console.log("handleFormSubmit", values);
    const payload = {
      // user_id: "EMP-3699",
      user_id: user_id,
      entryType: values.excludeType,
      code: values.excludeCode,
      excludeFrom: values.excludeFrom,
      remarks: values.excludeRemark,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .InsertClientExclusionEntry(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.isSuccess) {
          ShowToast("success", response?.data?.message);
          setmodal_grid(false);
          setRefreshTrigger((prev) => prev + 1);
        } else {
          ShowToast("error", response?.data?.message);
        }
      })
      .catch((error) => {
        console.log("API error", error);
        ShowToast("error", "Failed to process your request.");
      })
      .finally(() => dispatch(hideLoader()));
  };
  const handleDelete = (row: any) => {
    console.log("Delete karu ?", row);
    const payload = {
      // user_id: "EMP-3699",
      user_id: user_id,
      rowId: row.rowId,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .DeleteClientExclusionEntry(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.isSuccess) {
          ShowToast("success", response?.data?.message);
          setRefreshTrigger((prev) => prev + 1);
        } else {
          ShowToast("error", response?.data?.message);
        }
      })
      .catch((error) => {
        console.log("API error", error);
        ShowToast("error", "Failed to process your request.");
      })
      .finally(() => dispatch(hideLoader()));
  };

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            minHeight: "30vh",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardHeader
            style={{
              borderRadius: "15px 15px 0 0",
              backgroundColor: "#fff",
              padding: "0.2rem 0.8rem",
            }}
          >
            <h4 className="card-title mb-0">Client Exclusion List</h4>
          </CardHeader>
          <CardBody>
            <ModalComponent
              modal_grid={modal_grid}
              tog_grid={toggleModal}
              isClientExclusion={true}
              ExcludeOptions={excludeOptions}
              onSubmit={handleFormSubmit}
            />

            <Box>
              <Button
                type="button"
                variant="contained"
                className="btn-font"
                onClick={toggleModal}
                style={{
                  backgroundColor: "#11395C",
                  marginBottom: "1rem",
                }}
              >
                Add
              </Button>
            </Box>

            {/* Inputs */}
            <Box>
              <Row>
                {/* Branch Code Dropdown */}

                <Col md={3} sm={6} xs={12} className="mb-3">
                  <Label
                    htmlFor="type-selection"
                    className="form-label text-muted label-font"
                  >
                    Branch/Client
                  </Label>
                  <Select
                    inputId="type-selection"
                    value={selectedType}
                    onChange={setSelectedType}
                    options={TypeOfExclusionClient}
                    isClearable
                    styles={{
                      control: (base) => ({ ...base, fontSize: "12px" }),
                    }}
                  />
                </Col>
                {/* Client Code Input */}
                <Col
                  xs={12}
                  sm={6}
                  md={3}
                  className="mb-3"
                  style={{
                    flex: "0 0 auto",
                    minWidth: "140px",
                    maxWidth: "180px",
                  }}
                >
                  <Label
                    htmlFor="client-code-input"
                    className="form-label text-muted label-font"
                  >
                    Client Code
                  </Label>
                  <TextField
                    id="client-code-input"
                    value={clientCode}
                    onChange={(e) => setClientCode(e.target.value)}
                    placeholder="Enter client code"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </Col>
                {/* Dynamic Dropdown (API Options) */}
                <Col md={3} sm={6} xs={12} className="mb-3">
                  <Label
                    htmlFor="api-option"
                    className="form-label text-muted label-font"
                  >
                    Exclude From
                  </Label>
                  <Select
                    inputId="api-option"
                    value={selectedApiOption}
                    onChange={setSelectedApiOption}
                    options={excludeOptions}
                    isClearable
                    styles={{
                      control: (base) => ({ ...base, fontSize: "12px" }),
                    }}
                  />
                </Col>

                {/* View Button */}
                <Col
                  md={2}
                  sm={4}
                  xs={12}
                  className="mb-3 d-flex align-items-end"
                >
                  <Button
                    type="button"
                    onClick={handleView}
                    style={{
                      backgroundColor: "#11395C",
                      color: "#fff",
                      fontSize: "12px",
                      width: "100%",
                    }}
                  >
                    View
                  </Button>
                </Col>
              </Row>
            </Box>

            <UserInfoTable
              activeSubItem={activeSubItem}
              T6Data={data}
              getUserDetails={handleDelete}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Index;
