import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Chip, Grid } from "@mui/material";
import { Card, Container } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import RevenueCard from "../../../components/Revamp/RevenueCard";
import ComDropDown from "../../../components/common/Dropdown/commonDropdown";
import { AppDispatch, RootState } from "../../../redux/store";
import ProgressBar from "../../../components/Revamp/progressBar";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";

const ZoneTarget = () => {
  const [selectedZone, setSelectedZone] = useState<string>("ALL");
  const [data, setData] = useState<any[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { accessType, user_id } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data,
  );

  useEffect(() => {
    // setTabValue("Summary");
    const handleZonelData = async () => {
      const payload = {
        // empcode: "EMP-0096",
        empcode: user_id,
      };

      dispatch(showLoader("Fetching Details..."));

      try {
        const response = await apiServices.GetZoneRevenueTarget(payload);
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

    handleZonelData();
  }, [user_id, dispatch]);

  // ✅ FILTER DATA
  const filteredData = useMemo(() => {
    if (selectedZone === "ALL") return data;
    return data.filter((z) => z.zoneCode === selectedZone);
  }, [selectedZone, data]);

  return (
    <div className="page-content page-view">
      <Container fluid>
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            padding: 24,
          }}
        >
          {/* HEADER */}
          <Box sx={{ mb: 1 }}>
            <Typography fontSize={28} fontWeight={700}>
              Zone Target Overview
            </Typography>

            <Typography sx={{ color: "#7A7A7A", fontSize: 14, mb: 2 }}>
              FY26-27 Performance Breakdown Across Zones
            </Typography>

            {accessType === "ALL" && (
              <Box>
                <ComDropDown
                  onZoneChange={(z) => setSelectedZone(z?.value || "ALL")}
                />
              </Box>
            )}
          </Box>

          {/* 🔥 ZONE CARDS (FILTERED) */}
          <Grid container spacing={3}>
            {filteredData?.length > 0 ? (
              filteredData.map((zone) => (
                <Grid item xs={12} key={zone.zoneCode}>
                  <Box
                    sx={{
                      border: "1px solid #E5E7EB",
                      borderRadius: "16px",
                      p: 3,
                      width: "100%",
                      background: "#fff",
                      transition: "0.25s",
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 3,
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          {zone.zoneName}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 13,
                            color: "#8B8B8B",
                            mt: 0.5,
                          }}
                        >
                          {zone.financialYear}
                        </Typography>
                      </Box>

                      <Chip
                        label={zone.zoneCode}
                        variant="outlined"
                        sx={{
                          borderColor: "#185FA5",
                          color: "#185FA5",
                          fontWeight: 600,
                          borderRadius: "999px",
                          background: "#F8FBFF",
                        }}
                      />
                    </Box>

                    {/* Revenue Cards */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2,1fr)",
                          lg: "repeat(5,1fr)",
                        },
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <RevenueCard
                        title="BROKING TARGET"
                        value={`₹${zone.brokingTarget.toLocaleString()}`}
                        subtitle={`${(
                          (zone.brokingTarget / zone.totalTarget) *
                          100
                        ).toFixed(1)}% of total`}
                        color="#185FA5"
                      />

                      <RevenueCard
                        title="BROKING ACHIEVED"
                        value="₹0"
                        subtitle="0% done"
                        color="#185FA5"
                      />

                      <RevenueCard
                        title="NON-BKG TARGET"
                        value={`₹${zone.nonBrokingTarget.toLocaleString()}`}
                        subtitle={`${(
                          (zone.nonBrokingTarget / zone.totalTarget) *
                          100
                        ).toFixed(1)}% of total`}
                        color="#16A34A"
                      />

                      <RevenueCard
                        title="NON-BKG ACHIEVED"
                        value="₹0"
                        subtitle="0% done"
                        color="#16A34A"
                      />

                      <RevenueCard
                        title="OVERALL % DONE"
                        value="0%"
                        subtitle={`₹0 of ₹${zone.totalTarget.toLocaleString()}`}
                        color="#EA580C"
                        background="#FFF8F3"
                      />
                    </Box>

                    {/* Progress Bars */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "1fr",
                        },
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <ProgressBar
                        label="Broking Progress"
                        percentage={0}
                        color="#185FA5"
                        achieved="₹0"
                        target={`₹${zone.brokingTarget.toLocaleString()}`}
                      />

                      <ProgressBar
                        label="Non-Broking Progress"
                        percentage={0}
                        color="#16A34A"
                        achieved="₹0"
                        target={`₹${zone.nonBrokingTarget.toLocaleString()}`}
                      />
                    </Box>

                    <ProgressBar
                      label="Overall Zone Progress"
                      percentage={0}
                      color="#EA580C"
                      achieved="₹0"
                      target={`₹${zone.totalTarget.toLocaleString()}`}
                    />
                  </Box>
                </Grid>
              ))
            ) : (
              <Box sx={{ p: 3 }}>
                <Typography color="text.secondary">No data found</Typography>
              </Box>
            )}
          </Grid>
        </Card>
      </Container>
    </div>
  );
};

export default ZoneTarget;
