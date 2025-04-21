import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useEffect } from "react";

const News = ({ activeMenu }: any) => {
  useEffect(() => {
    console.log(activeMenu);
  }, [activeMenu]);

  return (
    <div>
      <div>
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            //   backgroundColor: "skyblue",
          }}
        >
          <CardMedia
            component="img"
            alt="Trump Auto Tariff"
            image="https://media.assettype.com/bloombergquint%2F2025-04-01%2F8wjohvbk%2FTrump-auto-tariff.jpg?w=1200&auto=format%2Ccompress&ogImage=true"
            sx={{
              width: 100,
              height: "100%",
              borderRadius: 1,
              objectFit: "cover",
            }}
          />
          <Box sx={{ ml: 2, flex: 1 }}>
            <CardContent sx={{ p: 0 }}>
              <Typography>
                Tata Consultancy Services Ltd - 532540 - Announcement under
                Regulation 30 (LODR)-Analyst / Investor Meet - Intimation
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Pursuant to Regulation 30 of SEBI (Listing Obligations and
                Disclosure Requirements) Regulations, 2015, we enclose herewith
                Schedule of Analyst/Institutional Investor Meeting with Key
                Managerial Personnel (KMP) of the Company planned for the month
                of April 2025.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 0 }}>
              <Button size="small" style={{ color: "#11395C" }}>
                Learn More
              </Button>
            </CardActions>
          </Box>
        </Card>
      </div>
    </div>
  );
};

export default News;
