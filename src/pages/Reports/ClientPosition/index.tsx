import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";
import * as Yup from "yup";
import { useFormik } from "formik";
import ShowToast from "../../../utils/toastUtils";
import UserInfoTable from "../../../components/common/UserInfoTable";

const ClientPosition = ({ activeSubItem }: any) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [slbmPositionData, setSlbmPositionData] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  const validationSchema = Yup.object({
    selectedZone: Yup.object().nullable().required("Zone is required"),
  });

  interface FormValues {
    selectedZone: { label: string; value: string } | null;
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
    },
    validationSchema,
    onSubmit: () => {
      handleSubmit();
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
          let zoneDropdown = res?.data.data.map((item: any) => ({
            label: item.desc, // This will be displayed in the dropdown
            value: item.val, // This will be the actual value
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
            "Sorry for the inconvenience, please try after some time.",
        );
      });

    dispatch(hideLoader());
  }, [dispatch]);

  const handleSubmit = () => {
    const payload = {
      clientCode: "",
      zone: formik.values.selectedZone?.value || "",
      branchCode: "",
      userID: user_id,
    };

    dispatch(showLoader("Fetching data..."));

    apiServices
      .SLBMPosition(payload)
      .then((response) => {
        const data = response?.data?.data;

        if (
          response?.status === 200 &&
          response?.data?.isSuccess &&
          Array.isArray(data)
        ) {
          const recordsWithId = data.map((item: any, index: number) => ({
            Id: index + 1,
            ...item,
          }));

          setSlbmPositionData(recordsWithId);

          console.log("SLBM Position Data:", recordsWithId);
        } else {
          setSlbmPositionData([]);
        }
      })
      .catch((error) => {
        console.log("SLBM Position Error:", error);
        setSlbmPositionData([]);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
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
                  <h4 className="card-title mb-0">{activeSubItem}</h4>
                </CardHeader>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
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

                      <Col className="d-flex flex-column-reverse">
                        <div className="mb-3" />

                        <Button
                          style={{
                            backgroundColor: "#11395C",
                            fontSize: "12px",
                            maxWidth: "150px",
                          }}
                          type="submit"
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
              </Card>

              <Card
                style={{
                  minHeight: "80vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardBody>
                  <UserInfoTable
                    activeSubItem={activeSubItem}
                    T6Data={slbmPositionData}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ClientPosition;
