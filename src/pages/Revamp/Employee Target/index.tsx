import { Box, Chip, Grid, Typography } from "@mui/material";
import { Card, Container } from "reactstrap";
import RevenueCard from "../../../components/Revamp/RevenueCard";
import ProgressBar from "../../../components/Revamp/progressBar";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";

const EmployeeTarget = () => {
  const [data, setData] = useState<any>({});

  const dispatch = useDispatch<AppDispatch>();
  const { user_id } = useSelector(
    (state: RootState) => state.AuthUser?.data?.data,
  );

  useEffect(() => {
    // setTabValue("Summary");
    const handleZonelData = async () => {
      const payload = {
        // empcode: "EMP-5376",
        empcode: user_id,
      };

      dispatch(showLoader("Fetching Details..."));

      try {
        const response = await apiServices.GetEmployeeRevenueTarget(payload);
        console.log("response EmployeeData", response?.data);

        setData(response?.data || null);
        // setData(response?.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    handleZonelData();
  }, [user_id, dispatch]);

  const isEmpty =
    !data || (!data.empName && !data.brokingTarget && !data.totalTarget);

  return (
    <div className="page-content page-view">
      <Container fluid>
        {" "}
        <Card
          style={{
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,.25)",
            padding: "24px",
          }}
        >
          {/* Header */}
          {isEmpty ? (
            <Box sx={{ p: 3, textAlign: "center", width: "100%" }}>
              <Typography color="text.secondary">
                No employee target data available
              </Typography>
            </Box>
          ) : (
            <>
              {/* HEADER */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 4,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {data?.empName}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#7B8794",
                      mt: 0.5,
                    }}
                  >
                    {data?.empCategory} • {data?.deptName} • FY{" "}
                    {data?.financialYear}
                  </Typography>
                </Box>

                <Chip
                  label={`Zone ${data?.zone}`}
                  sx={{
                    border: "1px solid #185FA5",
                    color: "#185FA5",
                    background: "#F8FBFF",
                    fontWeight: 600,
                  }}
                />
              </Box>

              {/* CARDS */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <RevenueCard
                    title="Broking Target"
                    value={`₹${data?.brokingTarget ?? 0}`}
                    subtitle={`${(
                      ((data?.brokingTarget ?? 0) / (data?.totalTarget || 1)) *
                      100
                    ).toFixed(1)}% of Total`}
                    color="#185FA5"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <RevenueCard
                    title="Non-Broking Target"
                    value={`₹${data?.nonBrokingTarget ?? 0}`}
                    subtitle={`${(
                      ((data?.nonBrokingTarget ?? 0) /
                        (data?.totalTarget || 1)) *
                      100
                    ).toFixed(1)}% of Total`}
                    color="#16A34A"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <RevenueCard
                    title="Total Target"
                    value={`₹${data?.totalTarget ?? 0}`}
                    subtitle="All Products"
                    color="#EA580C"
                  />
                </Grid>
              </Grid>

              {/* PROGRESS */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <ProgressBar
                  label="Broking Progress"
                  percentage={0}
                  achieved="₹0"
                  target={`₹${data?.brokingTarget ?? 0}`}
                  color="#185FA5"
                />

                <ProgressBar
                  label="Non-Broking Progress"
                  percentage={0}
                  achieved="₹0"
                  target={`₹${data?.nonBrokingTarget ?? 0}`}
                  color="#16A34A"
                />

                <ProgressBar
                  label="Overall Progress"
                  percentage={0}
                  achieved="₹0"
                  target={`₹${data?.totalTarget ?? 0}`}
                  color="#EA580C"
                />
              </Box>
            </>
          )}{" "}
        </Card>
      </Container>
    </div>
  );
};

export default EmployeeTarget;
