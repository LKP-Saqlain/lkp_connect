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
import Select from "react-select";
import { TypeOfExclusionClient } from "../../helper/tableColumns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import ShowToast from "../../utils/toastUtils";
import { useFormik } from "formik";
import * as Yup from "yup";

type SelectOption = {
  value: string;
  label: string;
};

const Index = ({ activeSubItem }: any) => {
  const [modal_grid, setmodal_grid] = useState(false);
  const [excludeOptions, setExcludeOptions] = useState<SelectOption[]>([]);
  const [filteredExcludeOptions, setFilteredExcludeOptions] = useState<
    SelectOption[]
  >([]);
  const [data, setdata] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const toggleModal = () => setmodal_grid(!modal_grid);

  // === Validation schema ===
  const validationSchema = Yup.object().shape({
    selectedType: Yup.object().nullable(),
    clientCode: Yup.string(),
    selectedApiOption: Yup.object()
      .nullable()
      .required("Please select Exclude From option"),
  });

  // === Formik setup ===
  const formik = useFormik({
    initialValues: {
      selectedType: null,
      clientCode: "",
      selectedApiOption: null,
    },
    validationSchema,
    onSubmit: (values) => {
      // Custom validation logic for Exclude From
      if (!values.selectedApiOption) {
        ShowToast("error", "Please select Exclude From option");
        return;
      }

      // Only call handleView when Exclude From is selected
      handleView(values);
    },
  });

  // === Fetch Exclude Options on Mount ===
  useEffect(() => {
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .GetExcludeOptions({})
      .then((res) => {
        if (res?.status === 200) {
          const formatted = res?.data?.data.map((item: any) => ({
            value: item.valitm,
            label: item.disitm,
          }));
          setExcludeOptions(formatted);

          // Filter out "T5T6Debit"
          const filtered = formatted.filter(
            (item: any) => item.label !== "T5T6Debit"
          );
          setFilteredExcludeOptions(filtered);
        }
      })
      .catch(() => console.log("Error while fetching exclude options"))
      .finally(() => dispatch(hideLoader()));
  }, [dispatch, user_id]);

  // === Fetch table data ===
  const handleView = (values: any) => {
    console.log("teststes", values, formik.values);

    const payload = {
      user_id: user_id,
      excludeFrom: values.selectedApiOption?.value || "1",
      entryType: values.selectedType?.value || "ALL",
      code: values.clientCode || "ALL",
    };
    console.log("Payload111", payload);

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetClientExclusionList(payload)
      .then((response) => {
        if (response?.status === 200) {
          const rawData = response?.data?.data || [];

          const filteredData = rawData.filter((item: any) => {
            return item !== null;
            // e.g. item.isActive === true
          });

          const finalData = filteredData.map((item: any, index: number) => ({
            ...item,
            Id: index + 1,
          }));

          setdata(finalData);
        }
      })
      .catch(() => console.log("Error while fetching exclude list"))
      .finally(() => dispatch(hideLoader()));
  };

  // === Add new entry submit handler ===
  const handleFormSubmit = (values: any) => {
    const payload = {
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
          handleView(formik.values);
        } else {
          ShowToast("error", response?.data?.message);
        }
      })
      .catch(() => ShowToast("error", "Failed to process your request."))
      .finally(() => dispatch(hideLoader()));
  };

  // === Delete entry handler ===
  const handleDelete = (row: any) => {
    const payload = { user_id: user_id, rowId: row.rowId };
    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .DeleteClientExclusionEntry(payload)
      .then((response) => {
        if (response?.status === 200 && response?.data?.isSuccess) {
          ShowToast("success", response?.data?.message);
          handleView(formik.values);
        } else {
          ShowToast("error", response?.data?.message);
        }
      })
      .catch(() => ShowToast("error", "Failed to process your request."))
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 className="card-title mb-0">Client Exclusion List</h4>
              <Button
                type="button"
                onClick={toggleModal}
                style={{
                  backgroundColor: "#11395C",
                  height: "32px",
                  fontSize: "13px",
                  textTransform: "none",
                  borderRadius: "6px",
                }}
              >
                Add
              </Button>
            </div>
          </CardHeader>

          <CardBody>
            <ModalComponent
              modal_grid={modal_grid}
              tog_grid={toggleModal}
              isClientExclusion={true}
              ExcludeOptions={filteredExcludeOptions}
              onSubmit={handleFormSubmit}
            />

            {/* === Formik-controlled Inputs === */}
            <form onSubmit={formik.handleSubmit}>
              <Box>
                <Row>
                  {/* Branch/Client */}
                  <Col md={3} sm={6} xs={12} className="mb-3">
                    <Label
                      htmlFor="type-selection"
                      className="form-label text-muted label-font"
                    >
                      Branch/Client
                    </Label>
                    <Select
                      inputId="type-selection"
                      value={formik.values.selectedType}
                      onChange={(option) =>
                        formik.setFieldValue("selectedType", option)
                      }
                      options={TypeOfExclusionClient}
                      isClearable
                      styles={{
                        control: (base) => ({ ...base, fontSize: "12px" }),
                      }}
                    />
                  </Col>

                  {/* Client Code */}
                  <Col md={3} sm={6} xs={12} className="mb-3">
                    <Label
                      htmlFor="client-code-input"
                      className="form-label text-muted label-font"
                    >
                      Client Code
                    </Label>
                    <TextField
                      id="client-code-input"
                      name="clientCode"
                      value={formik.values.clientCode}
                      onChange={formik.handleChange}
                      placeholder="Enter client code"
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                  </Col>

                  {/* Exclude From */}
                  <Col md={3} sm={6} xs={12} className="mb-3">
                    <Label
                      htmlFor="api-option"
                      className="form-label text-muted label-font"
                    >
                      Exclude From
                    </Label>
                    <Select
                      inputId="api-option"
                      value={formik.values.selectedApiOption}
                      onChange={(option) =>
                        formik.setFieldValue("selectedApiOption", option)
                      }
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
                      type="submit"
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
            </form>

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
