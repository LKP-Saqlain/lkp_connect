import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import UserInfoTable from "../../../components/common/UserInfoTable";
import { Box, Button, InputLabel, MenuItem } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiServices } from "../../../services";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { useEffect, useState } from "react";

const financialYears = [
  { value: "2019-2020", label: "2019-2020" },
  { value: "2020-2021", label: "2020-2021" },
  { value: "2021-2022", label: "2021-2022" },
  { value: "2022-2023", label: "2022-2023" },
  { value: "2023-2024", label: "2023-2024" },
  { value: "2024-2025", label: "2024-2025" },
];
const documentType = [
  { value: "Circular", label: "Circular" },
  { value: "ALL", label: "ALL" },
];
const department = [
  { value: "IT", label: "IT" },
  { value: "Account", label: "Account" },
  { value: "RMS", label: "RMS" },
  { value: "ALL", label: "ALL" },
];

const Retrival = ({ activeSubItem }: any) => {
  // const [selectedButton, setSelectedButton] = useState<string>("Daily");
  const [userData, setUserData] = useState([]);

  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:600px)");

  const formik = useFormik({
    initialValues: {
      finYear: "",
      documentType: "",
      department: "",
    },
    validationSchema: Yup.object({
      finYear: Yup.string().required("Please select a Financial Year"),
      documentType: Yup.string().required("Please select  Document Type"),
      department: Yup.string().required("Please select Department"),
    }),
    onSubmit: async (values) => {
      const { finYear } = values;
      console.log("submitClick", finYear);
      fetchComplianceReport();
    },
  });
  useEffect(() => {
    console.log("formikValls", formik.values);
  }, [formik.values]);

  const fetchComplianceReport = async () => {
    let payload = {
      financialYear: "2024-2025",
      department: "ALL",
      action: "viewReport",
      documentType: "",
      typeOfDocuments: "ALL",
      communicationType: "",
      communicationProof: "",
      communicationProofPath: "",
      dateOfCommunication: "02/03/2025",
      rowId: 0,
      userId: "",
    };
    dispatch(showLoader("Please wait"));
    apiServices
      .ComplainceReport(payload)
      .then((response) => {
        dispatch(hideLoader());
        console.log("apiResponse", response?.data?.Table);
        setUserData(response?.data?.Table);
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.log("Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <Card>
      <CardHeader className="p-0 border-0 bg-light-subtle">
        <div className="p-3 border border-dashed border-start-0">
          <h4 className="card-title mb-0">Communication Retrival Report</h4>
          {/* <div className="d-flex gap-1">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedButton("Daily")}
                  sx={
                    selectedButton === "Daily"
                      ? selectedStyle
                      : nonSelectedStyle
                  }
                >
                  F.Y.
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedButton("Weekly")}
                  sx={
                    selectedButton === "Weekly"
                      ? selectedStyle
                      : nonSelectedStyle
                  }
                >
                  Type of document
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedButton("Monthly")}
                  sx={
                    selectedButton === "Monthly"
                      ? selectedStyle
                      : nonSelectedStyle
                  }
                >
                  Department
                </Button>
              </div> */}
        </div>
      </CardHeader>
      <CardBody>
        {" "}
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col xs={12} md={3} lg={4}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl
                  fullWidth
                  error={
                    formik.touched.finYear && Boolean(formik.errors.finYear)
                  }
                >
                  <InputLabel id="financial-year-select-label">
                    Financial Year
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="financial-year-select-label"
                    id="financial-year-select"
                    name="finYear"
                    value={formik.values.finYear}
                    label="Financial Year"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ fontFamily: "Public Sans" }}
                  >
                    {financialYears.map((year) => (
                      <MenuItem key={year.value} value={year.value}>
                        {year.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.finYear && formik.errors.finYear && (
                    <p className="text-error">{formik.errors.finYear}</p>
                  )}
                </FormControl>
              </Box>
            </Col>
            <Col
  xs={12}
  md={3}
  lg={4}
  style={{ marginTop: isMobile ? "16px" : "0" }}
>
  <Box sx={{ minWidth: 120 }}>
    <FormControl
      fullWidth
      error={
        formik.touched.documentType && Boolean(formik.errors.documentType)
      }
    >
      <InputLabel id="documentType-select-label">Types Of Documents</InputLabel>
      <Select
        size="small"
        labelId="documentType-select-label"
        id="documentType-select"
        name="documentType"
        value={formik.values.documentType}
        label="Types Of Documents"  
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        sx={{ fontFamily: "Public Sans" }}
      >
        {documentType.map((docType) => (
          <MenuItem key={docType.value} value={docType.value}>
            {docType.label}
          </MenuItem>
        ))}
      </Select>
      {formik.touched.documentType && formik.errors.documentType && (
        <p className="text-error">{formik.errors.documentType}</p>
      )}
    </FormControl>
  </Box>
</Col>

            <Col
              xs={12}
              md={3}
              lg={4}
              style={{ marginTop: isMobile ? "16px" : "0" }}
            >
              <Box sx={{ minWidth: 120 }}>
                <FormControl
                  fullWidth
                  error={
                    formik.touched.department &&
                    Boolean(formik.errors.department)
                  }
                >
                  <InputLabel id="department-select-label">
                    Department
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="department-select-label"
                    id="department-select"
                    name="department"
                    value={formik.values.department}
                    label="Department"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ fontFamily: "Public Sans" }}
                  >
                    {department.map((dept) => (
                      <MenuItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.department && formik.errors.department && (
                    <p className="text-error">{formik.errors.department}</p>
                  )}
                </FormControl>
              </Box>
            </Col>
            <Col xs={12} md={4} lg={4}>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  className="btn-font"
                  sx={{
                    width: isMobile ? "100%" : "50%",
                    backgroundColor: "#11395C",
                    "&:hover": {
                      backgroundColor: "#0d2d4a",
                    },
                    fontFamily: "Public Sans",
                    marginTop: "0.8rem",
                  }}
                >
                  View Report
                </Button>
              </Box>
            </Col>
          </Row>
        </form>
      </CardBody>
      <CardBody>
        <UserInfoTable activeSubItem={activeSubItem} T6Data={userData} />
      </CardBody>
    </Card>
  );
};

export default Retrival;
