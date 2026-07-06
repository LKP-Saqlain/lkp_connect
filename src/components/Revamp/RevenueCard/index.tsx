import { Box, Typography } from "@mui/material";

interface RevenueCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  background?: string;
}

const RevenueCard = ({
  title,
  value,
  subtitle,
  color,
  background = "#F8FAFC",
}: RevenueCardProps) => {
  return (
    <Box
      sx={{
        background,
        borderRadius: "12px",
        p: 2,
        height: "100%",
        minHeight: 92,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: "10px",
          fontWeight: 700,
          color: "#7D8799",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: {
            xs: "13px",
            md: "18px",
          },
          fontWeight: 800,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          fontSize: "12px",
          color: "#9CA3AF",
          mt: 1,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default RevenueCard;
