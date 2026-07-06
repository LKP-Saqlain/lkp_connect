import { Box, LinearProgress, Typography } from "@mui/material";

interface ProgressBarProps {
  label: string;
  percentage: number;
  color?: string;
  achieved?: string;
  target?: string;
}

const ProgressBar = ({
  label,
  percentage,
  color = "#185FA5",
  achieved,
  target,
}: ProgressBarProps) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color,
          }}
        >
          {percentage.toFixed(1)}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 10,
          borderRadius: "999px",
          backgroundColor: "#E5E7EB",

          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: "999px",
          },
        }}
      />

      {(achieved || target) && (
        <Typography
          sx={{
            mt: 1,
            textAlign: "right",
            fontSize: "13px",
            fontWeight: 700,
            color,
          }}
        >
          {percentage.toFixed(1)}% • {achieved} / {target}
        </Typography>
      )}
    </Box>
  );
};

export default ProgressBar;
