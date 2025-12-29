import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
} from "reactstrap";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { apiServices } from "../../../services";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import ShowToast from "../../../utils/toastUtils";
import DashboardCard from "../../../components/common/DashboardCard";
import { extractBarModelData, keyMapping } from "../../../helper/method";
import ZoneTargetChart from "../../../components/common/zoneTargetChart";
import { Button as MuiButton } from "@mui/material";

interface FormValues {
  selectedZone: { label: string; value: string } | null;
}
interface MetricData {
  total: number;
  direct: number;
  indirect: number;
}

const ZoneTarget = ({ activeSubItem }: any) => {
  const [noSortingGroup, setNoSortingGroup] = useState([]);
  const [zoneTargetData, setZoneTargetData] = useState({
    total: 0,
    direct: 0,
    indirect: 0,
  });
  const [zoneTargetAchievedData, setZoneTargetAchievedData] = useState({
    total: 0,
    direct: 0,
    indirect: 0,
  });
  const [
    zoneTargetAchievedPercentageData,
    setZoneTargetAchievedPercentageData,
  ] = useState({
    total: 0,
    direct: 0,
    indirect: 0,
  });
  const [activeBadges, setActiveBadges] = useState<string[]>(
    Array(4).fill("total")
  );
  const [zoneBarData, setZoneBarData] = useState({
    bdm: null,
    bidm: null,
    btm: null,
  });
  const [selectedType, setSelectedType] = useState<
    "both" | "target" | "achieved"
  >("both");

  const dispatch = useDispatch<AppDispatch>();
  const { accessType } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data
  );
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const formik = useFormik<FormValues>({
    initialValues: {
      selectedZone: null,
    },
    // validationSchema,
    onSubmit: (values) => {
      // Only called if no validation errors
      console.log("activeSubItem values1-->", activeSubItem, values);
      // handleSubmit(values);
      // handleDownloadExcel();
    },
  });

  useEffect(() => {
    if (accessType === "ALL") {
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
              "Sorry for the inconvenience, please try after some time."
          );
        });

      dispatch(hideLoader());
    }
  }, [dispatch, accessType]);

  useEffect(() => {
    if (!user_id) return;

    const payload = {
      quarterName: "Q3",
      zone: formik.values.selectedZone?.value || "ALL",
      user_ID: user_id,
    };

    dispatch(showLoader(""));

    apiServices
      .GetZoneTargetdata(payload)
      .then((response) => {
        dispatch(hideLoader());
        if (response?.status === 200) {
          const data = response?.data?.data;
          console.log("Zone Target API Response:", data);

          if (data) {
            const targets = data.targets?.[0] || {};
            setZoneTargetData({
              total: targets.ttb || 0,
              direct: targets.tdb || 0,
              indirect: targets.tidb || 0,
            });

            const actuals = data.actuals?.[0] || {};
            setZoneTargetAchievedData({
              total: actuals.t_ach_b || 0,
              direct: actuals.z_ach_db || 0,
              indirect: actuals.z_ach_idb || 0,
            });

            const percentages = data.percentages?.[0] || {};
            setZoneTargetAchievedPercentageData({
              total: parseFloat(percentages.t_ach_pct) || 0,
              direct: parseFloat(percentages.d_ach_pct) || 0,
              indirect: parseFloat(percentages.id_ach_pct) || 0,
            });

            const zonebarData = data.zonebarData?.[0];
            if (zonebarData) {
              setZoneBarData({
                bdm: transformModelKeys(zonebarData.bdm),
                bidm: transformModelKeys(zonebarData.bidm),
                btm: transformModelKeys(zonebarData.btm),
              });
            }
          }
        }
      })
      .catch((error) => {
        console.log("Zone Target API Error:", error);
        dispatch(hideLoader());
        ShowToast("error", "Failed to fetch Zone Target data.");
      });
  }, [dispatch, user_id, formik.values.selectedZone]);

  const metrics = [
    { title: "Zone Target", data: zoneTargetData },
    { title: "Zone Target Achieved", data: zoneTargetAchievedData },
    { title: "Zone Target Achieved %", data: zoneTargetAchievedPercentageData },
  ];

  const getMetricValue = (index: number): number => {
    const badge = activeBadges[index];
    const dataArray = [
      zoneTargetData,
      zoneTargetAchievedData,
      zoneTargetAchievedPercentageData,
    ];
    console.log("badgeValue", badge, dataArray);

    return dataArray[index][badge as keyof MetricData] || 0;
  };

  const handleBadgeClick = (cardIndex: number, type: string) => {
    setActiveBadges((prev) => {
      const updated = [...prev];
      updated[cardIndex] = type;
      return updated;
    });
  };

  const transformModelKeys = (model: any) => {
    if (!model) return model;

    const transformed: any = {};

    Object.keys(model).forEach((key) => {
      const mappedKey = keyMapping[key] || key; // fallback to original
      transformed[mappedKey] = model[key];
    });

    return transformed;
  };

  const directChartData = extractBarModelData(zoneBarData.bdm, "Direct");
  const indirectChartData = extractBarModelData(zoneBarData.bidm, "Indirect");
  const totalChartData = extractBarModelData(zoneBarData.btm, "Total");

  // const allValues = [
  //   ...directChartData.series.flatMap((s) => s.data),
  //   ...indirectChartData.series.flatMap((s) => s.data),
  //   ...totalChartData.series.flatMap((s) => s.data),
  // ];

  // const maxValue = Math.max(...allValues);
  const colorMap: Record<"both" | "target" | "achieved", [string, string]> = {
    both: ["#11395C", "#fff"], // [bgColor, textColor]
    target: ["#11395C", "#fff"],
    achieved: ["#F57C00", "#fff"],
  };
  return (
    <React.Fragment>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col lg={12}>
              {accessType === "ALL" && (
                <Card style={{ marginBottom: "0.7rem" }}>
                  <Row style={{ margin: "5px", minWidth: "100%" }}>
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
                            {noSortingGroup.map((zone: any) => {
                              const isSelected =
                                formik.values.selectedZone?.value ===
                                zone.value;

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
              <Row>
                {metrics.map((metric, index) => {
                  const badges = [
                    {
                      type: "warning",
                      label: "Total",
                      value: metric.data.total,
                      isActive: activeBadges[index] === "total",
                      onClick: () => handleBadgeClick(index, "total"),
                    },
                    {
                      type: "info",
                      label: "Direct",
                      value: metric.data.direct,
                      isActive: activeBadges[index] === "direct",
                      onClick: () => handleBadgeClick(index, "direct"),
                    },
                    {
                      type: "primary",
                      label: "Indirect",
                      value: metric.data.indirect,
                      isActive: activeBadges[index] === "indirect",
                      onClick: () => handleBadgeClick(index, "indirect"),
                    },
                  ];

                  return (
                    <Col
                      key={index}
                      xxl={4}
                      lg={4}
                      md={4}
                      sm={12}
                      style={{ marginBottom: "1rem" }}
                    >
                      <DashboardCard
                        title={metric.title}
                        value={getMetricValue(index)}
                        badges={badges}
                        customZoneClass={true}
                        customClass={true}
                        mainCustomClass={true}
                      />
                    </Col>
                  );
                })}
              </Row>
              <Card
                style={{
                  minHeight: "55vh",
                  borderRadius: "15px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                <CardHeader
                  style={{
                    borderRadius: "15px 15px 0 0",
                    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#fff",
                    padding: "0.5rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {/* Left side title */}
                  <h4 className="card-title mb-0">Zone Target Q3</h4>

                  {/* Right side buttons */}
                  <div style={{ display: "flex", gap: "1px" }}>
                    {(["both", "target", "achieved"] as const).map((view) => (
                      <MuiButton
                        key={view}
                        size="small"
                        onClick={() => setSelectedType(view)}
                        style={{
                          borderRadius: "6px",
                          fontWeight: 500,
                          minWidth: 80,
                          margin: "0px 2px",
                          backgroundColor:
                            selectedType === view
                              ? colorMap[view][0]
                              : undefined,
                          color:
                            selectedType === view
                              ? colorMap[view][1]
                              : undefined,
                        }}
                        variant={
                          selectedType === view ? "contained" : "outlined"
                        }
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}{" "}
                        {/* Capitalize label */}
                      </MuiButton>
                    ))}
                  </div>
                </CardHeader>

                <CardBody>
                  <Row>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <ZoneTargetChart
                        title="Direct"
                        categories={directChartData.categories}
                        series={
                          selectedType === "both"
                            ? directChartData.series
                            : directChartData.series.filter((s) =>
                                selectedType === "target"
                                  ? s.name.includes("Target")
                                  : s.name.includes("Achieved")
                              )
                        }
                        borderRight
                        selectedType={selectedType}
                      />
                      <ZoneTargetChart
                        title="Indirect"
                        categories={indirectChartData.categories}
                        series={
                          selectedType === "both"
                            ? indirectChartData.series
                            : indirectChartData.series.filter((s) =>
                                selectedType === "target"
                                  ? s.name.includes("Target")
                                  : s.name.includes("Achieved")
                              )
                        }
                        borderRight
                        selectedType={selectedType}
                      />
                      <div style={{ flex: 1, paddingRight: "20px" }}>
                        <ZoneTargetChart
                          title="Total"
                          categories={totalChartData.categories}
                          series={
                            selectedType === "both"
                              ? totalChartData.series
                              : totalChartData.series.filter((s) =>
                                  selectedType === "target"
                                    ? s.name.includes("Target")
                                    : s.name.includes("Achieved")
                                )
                          }
                          selectedType={selectedType}
                        />
                      </div>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ZoneTarget;
