import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
} from "reactstrap";
import DataTable from "../../../components/common/UserInfoTable";
import * as Yup from "yup";
import { useFormik } from "formik";
import ShowToast from "../../../utils/toastUtils";
import Select from "react-select";

const EmployeeTargetReport = ({ activeSubItem }: any) => {
  const [data, setData] = useState<any>();
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  interface OptionType {
    value: string;
    label: string;
  }

  // Define Formik form values
  interface FormValues {
    selectedZone: OptionType | null;
  }

  const validationSchema = Yup.object({
    selectedZone: Yup.object().nullable().required("Zone is required"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
    },
    validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("values1-->", values);
      // handleSubmit(values);
      // handleDownloadExcel();
    },
  });

  useEffect(() => {
    const str = user_id;
    const userType = localStorage.getItem("uIdType");
    let extractUserId: string | null = null;

    if (str) {
      const parts = str.split("-");
      if (parts.length > 1) {
        extractUserId = parts[1];
      }
    }
    let payload = {
      user_id: str === "APN-7161" ? "5376" : extractUserId,
      option: "zone",
      userType:
        str === "APN-7161" ? "EMP" : userType === "Employee" ? "EMP" : "APN",
      zone: "ALL",
    };

    const username = "admin";
    const password = "admin";
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials); // Base64 encode
    const LoginauthHeader = `Basic ${encodedCredentials}`;

    const customHeaders = {
      Authorization: LoginauthHeader, // Use LoginauthHeader for this request
    };

    dispatch(showLoader("Please wait, we are processing your request..."));
    apiServices
      .getDropDown(payload, customHeaders)
      .then((res) => {
        console.log("Response-->", res);
        if (res?.status === 200) {
          let zoneDropdown = res?.data.map((item: any) => ({
            label: item.itemVal, // This will be displayed in the dropdown
            value: item.itemVal, // This will be the actual value
          }));
          console.log("dropdown value", zoneDropdown);
          setNoSortingGroup(zoneDropdown);
          if (zoneDropdown.length > 0) {
            formik.setFieldValue("selectedZone", zoneDropdown[0]);
          }
          // setSelectedNoSortingGroup(selectedNoSortingGroup);
        }
      })
      .catch((Err) => {
        const { message } = Err.response.data;
        console.log("Error->", message);
        dispatch(hideLoader());
        // formik.setFieldError("password", message);
        const errorMessage = Err.response.data.message;
        ShowToast(
          "error",
          errorMessage ||
            "Sorry for the inconvenience, please try after some time."
        );
      });

    dispatch(hideLoader());
  }, [dispatch]);

  useEffect(() => {
    const payload = {
      //   user_id: "EMP-0238",
      user_id: user_id,
      zone: formik.values.selectedZone?.value,
    };
    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .GetEmpContestReport(payload)
      .then((response) => {
        const result = response?.data?.data || [];
        console.log("A1 GEmployee Performance", result);
        setData(
          result.map((item: any, index: any) => ({
            ...item,
            id: index + 1,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching compliance data:", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [dispatch, formik.values.selectedZone]);

  useEffect(() => {
    console.log("testsad", formik.values);
  }, [formik.values]);

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
            <h4 className="card-title mb-0">
              Employee Target Report{" "}
              <span style={{ fontSize: "12px" }}> (July-September)</span>
            </h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <Row>
                  <Col xl={3}>
                    <div className="mb-3" style={{ maxWidth: "300px" }}>
                      <Label
                        htmlFor="zone-select"
                        className="form-label text-muted label-font"
                      >
                        Zone
                      </Label>
                      <Select
                        value={formik.values.selectedZone}
                        onChange={(option: any) =>
                          formik.setFieldValue("selectedZone", option)
                        }
                        onBlur={formik.handleBlur}
                        options={noSortingGroup}
                        isClearable
                        className="placeholder-font"
                        id="zone-select"
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            cursor: "pointer",
                            borderColor:
                              formik.touched.selectedZone &&
                              formik.errors.selectedZone
                                ? "#DC4535"
                                : base.borderColor,
                            "&:hover": {
                              borderColor:
                                formik.touched.selectedZone &&
                                formik.errors.selectedZone
                                  ? "#DC4535"
                                  : base.borderColor,
                            },
                          }),
                        }}
                      />
                      {formik.touched.selectedZone &&
                        formik.errors.selectedZone && (
                          <div
                            className="text-danger"
                            style={{ fontSize: "12px" }}
                          >
                            {formik.errors.selectedZone}
                          </div>
                        )}
                    </div>
                  </Col>
                </Row>
              </div>
            </form>
            <DataTable activeSubItem={activeSubItem} T6Data={data} />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default EmployeeTargetReport;
