import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { cardDetails } from "../../../helper/tableColumns.tsx";
import { useTheme, useMediaQuery } from "@mui/material";
import { Button, Card, CardBody, CardHeader } from "reactstrap";

const MarketingMaterial = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card>
      <CardHeader>
        <h4 className="card-title mb-0">Marketing Materials</h4>
      </CardHeader>
      <CardBody>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "",
          }}
        >
          {cardDetails.map((card: any) => (
            <Card
              key={card.id}
              style={{
                width: isMobile ? "100%" : "240px",
                margin: "6px",
                padding: "16px",
                borderRadius: "16px",
                marginBottom: isMobile ? "12px" : "0px",
                // backgroundColor:"##11395C",
                boxShadow: isMobile
                  ? "0 6px 12px rgba(0, 0, 0, 0.3)" // Darker shadow for mobile
                  : "0 12px 24px rgba(0, 0, 0, 0.4)", // Darker shadow for desktop
              }}
            >
              <CardMedia
                component="img"
                image={card.imageUrl}
                alt={card.title}
                sx={{ height: 200, objectFit: "cover" }}
              />
              <CardContent>
                <Typography
                  style={{
                    fontSize: isMobile ? 12 : 14,
                    color: "#11395C",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {card.title}
                </Typography>
              </CardContent>
              <Button
                variant="contained"
                fullWidth
                style={{
                  backgroundColor: "#11395C",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
                href={card.pdfUrl}
                target="_blank"
                download={card.title}
                disabled={!card.pdfUrl}
              >
                {card.pdfUrl ? "Download" : "No PDF Available"}
              </Button>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default MarketingMaterial;
