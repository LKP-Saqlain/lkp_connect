import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import { AppDispatch, RootState } from "../../../../redux/store";
import { hideLoader, showLoader } from "../../../../redux/slices/loaderSlice";
import { apiServices } from "../../../../services";
import ShowToast from "../../../../utils/toastUtils";
import { useFormik } from "formik";
import DashboardCard from "../../../../components/common/DashboardCard";
// import { useTheme } from "@mui/material";
import UserInfoTable from "../../../../components/common/UserInfoTable";

interface FormValues {
  selectedZone: { label: string; value: string } | null;
}

const IndirectTarget = ({ activeSubItem }: { activeSubItem: string }) => {
  const [quarterlyBrokerage, setQuarterlyBrokerage] = useState({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
  });
  const [zoneList, setZoneList] = useState([]);
  const [apBrokerageList, setApBrokerageList] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  // const theme = useTheme();

  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik<FormValues>({
    initialValues: { selectedZone: null },
    onSubmit: () => {},
  });

  const fetchGrossBrokerageQuarter = () => {
    let payload = {
      user_id: user_id,
      zone: formik.values.selectedZone?.value || "ALL",
    };
    dispatch(showLoader(""));
    apiServices
      .GetAPGrossBrokeragePerQuarter(payload)
      .then((response) => {
        if (response?.status === 200) {
          dispatch(hideLoader());
          const apiData = response?.data?.data;
          console.log("Response →", apiData);
          setQuarterlyBrokerage(apiData?.quarterlyBrokerage);

          // store array of objects (with id added)
          const rowsWithId = apiData?.apList?.map((item: any, idx: number) => ({
            Id: idx + 1,
            ...item,
          }));
          console.log("rowsWithId", rowsWithId);

          setApBrokerageList(rowsWithId || []);
        }
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.log("Errror", error);
      });
  };

  useEffect(() => {
    if (accessType !== "ALL") return;

    const parts = user_id?.split("-");
    const extractedId = parts?.[1] || null;

    const payload = {
      user_id: user_id === "APN-7161" ? "5376" : extractedId,
      option: "zone",
      userType:
        user_id === "APN-7161"
          ? "EMP"
          : localStorage.getItem("uIdType") === "Employee"
          ? "EMP"
          : "APN",
      zone: "ALL",
    };

    const headers = {
      Authorization: `Basic ${btoa("admin:admin")}`,
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    apiServices
      .getDropDown(payload, headers)
      .then((res) => {
        if (res?.status !== 200) return;

        const dropdown = res.data.data.map((item: any) => ({
          label: item.desc,
          value: item.val,
        }));

        setZoneList(dropdown);
        if (dropdown.length) formik.setFieldValue("selectedZone", dropdown[0]);
      })
      .catch((err) => {
        ShowToast("error", err?.response?.data?.message);
      })
      .finally(() => dispatch(hideLoader()));
  }, [accessType]);

  useEffect(() => {
    fetchGrossBrokerageQuarter();
  }, [formik.values.selectedZone?.value]);

  return (
    <div className="page-content page-view">
      <div className="container-fluid">
        <Row>
          <Col lg={12}>
            {accessType === "ALL" && (
              <Card
                style={{
                  marginBottom: "0.6rem",
                  // width: "fit-content",
                }}
              >
                <Row
                  style={{
                    margin: "5px",
                    minWidth: "100%",
                  }}
                >
                  <Col
                    xs={12}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start", // or "center" if you want horizontal centering
                    }}
                  >
                    <div className="m-1">
                      <div className="d-flex align-items-center gap-2">
                        {/* Label (not scrollable) */}
                        <Label
                          htmlFor="zone-select"
                          className="form-label text-muted label-font mb-0"
                          style={{ minWidth: "50px" }}
                        >
                          Zone
                        </Label>

                        {/* Scrollable horizontal buttons */}
                        <div
                          className="d-flex flex-nowrap gap-2 overflow-auto"
                          style={{ maxWidth: "100%" }}
                        >
                          {zoneList.map((zone: any) => {
                            const isSelected =
                              formik.values.selectedZone?.value === zone.value;

                            return (
                              <Button
                                key={zone.value}
                                type="button"
                                style={{
                                  minWidth: "60px",
                                  whiteSpace: "nowrap",
                                  fontSize: "12px",
                                  padding: "2px",
                                  borderRadius: "6px",
                                  border: "1px solid #11395c",
                                  backgroundColor: isSelected
                                    ? "#11395c"
                                    : "#ffffff",
                                  color: isSelected ? "#ffffff" : "#11395c",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  formik.setFieldValue("selectedZone", zone)
                                }
                                onBlur={() =>
                                  formik.setFieldTouched("selectedZone", true)
                                }
                              >
                                {zone.label}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Validation error message */}
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
              </Card>
            )}

            <Row className="my-2">
              {[
                {
                  title: "Gross Brokerage",
                  value: quarterlyBrokerage.q1,
                  indirectQuarter: "Q1",
                },
                {
                  title: "Gross Brokerage",
                  value: quarterlyBrokerage.q2,
                  indirectQuarter: "Q2",
                },
                {
                  title: "Gross Brokerage",
                  value: quarterlyBrokerage.q3,
                  indirectQuarter: "Q3",
                },
                {
                  title: "Gross Brokerage",
                  value: quarterlyBrokerage.q4,
                  indirectQuarter: "Q4",
                },
              ].map((card, i) => (
                <Col key={i} xxl={3} lg={3} md={6} sm={12}>
                  <DashboardCard
                    title={card.title}
                    value={card.value}
                    IndirectQuarter={card.indirectQuarter}
                    customClass
                  />
                </Col>
              ))}
            </Row>
            <Card
              style={{
                // minHeight: "55vh",
                borderRadius: 15,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
            >
              <CardHeader
                style={{
                  borderRadius: "15px 15px 0 0",
                  backgroundColor: "#fff",
                  //   padding: "0.6rem 1rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h4 className="card-title mb-0">{activeSubItem}</h4>
              </CardHeader>

              <CardBody>
                <UserInfoTable
                  activeSubItem={activeSubItem}
                  T6Data={apBrokerageList}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default IndirectTarget;
