import { useEffect, useState } from "react";
import {
  useMediaQuery,
  useTheme,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { Card, CardBody, CardHeader, Button, Container } from "reactstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store.ts";
import { apiServices } from "../../services/index.ts";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice.ts";

interface MaterialItem {
  id: number;
  title: string;
  imageUrl: string;
  pdfUrl: string;
}

const convertBlobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const MarketingMaterial = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();
  const [materials, setMaterials] = useState<MaterialItem[]>([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      dispatch(showLoader("Please wait..."));
      try {
        const response = await apiServices.ViewMarketingMaterials({});
        const data = response?.data?.Table || [];

        const transformed: MaterialItem[] = await Promise.all(
          data.map(async (item: any, index: number) => {
            const [imgFileName = ""] =
              item.UploadImages?.split("\\").slice(-1) || [];
            const [docFileName = ""] =
              item.UploadDocuments?.split("\\").slice(-1) || [];

            let imageUrl = "";
            if (imgFileName) {
              const [name, ext] = imgFileName.split(".");
              const imgPayload = {
                fileName: name,
                filePath: "D:\\PROJECT\\",
                fileType: `.${ext}`,
                contentType: "",
              };

              try {
                const imgResp = await apiServices.ComplianceDownload(
                  imgPayload
                );
                if (imgResp?.status === 200 && imgResp?.data) {
                  const blob = new Blob([imgResp.data]);
                  imageUrl = await convertBlobToBase64(blob);
                }
              } catch (e) {
                console.warn("Image load failed:", e);
              }
            }

            return {
              id: item.RowId || index,
              title: item.Description || "Untitled",
              imageUrl,
              pdfUrl: docFileName,
            };
          })
        );

        setMaterials(transformed);
      } catch (error) {
        console.error("Error fetching marketing materials:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchMaterials();
  }, [dispatch]);

  const handleDownload = async (item: MaterialItem) => {
    const [name = "", ext = ""] = item.pdfUrl?.split(".") || [];

    const payload = {
      fileName: name,
      filePath: "D:\\PROJECT\\",
      fileType: `.${ext}`,
      contentType: "",
    };

    dispatch(showLoader("Downloading..."));

    try {
      const response = await apiServices.ComplianceDownload(payload);
      if (response?.status === 200 && response?.data) {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", item.pdfUrl);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.warn("Download failed");
      }
    } catch (error: any) {
      console.error("Download error:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

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
            <h4 className="card-title mb-0">Marketing Materials</h4>
          </CardHeader>
          <CardBody style={{ minHeight: "75vh" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              {materials.map((item) => (
                <Card
                  key={item.id}
                  style={{
                    width: isMobile ? "100%" : "200px",
                    margin: "5px",
                    padding: "10px",
                    borderRadius: "16px",
                    boxShadow: isMobile
                      ? "0 6px 12px rgba(0, 0, 0, 0.3)"
                      : "0 12px 24px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{ height: 120, objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography
                      style={{
                        fontSize: isMobile ? 10 : 12,
                        color: "#11395C",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </CardContent>
                  <Button
                    onClick={() => handleDownload(item)}
                    style={{
                      backgroundColor: "#11395C",
                      fontWeight: "bold",
                      textTransform: "none",
                      width: "100%",
                    }}
                    disabled={!item.pdfUrl}
                  >
                    {item.pdfUrl ? "Download" : "No PDF Available"}
                  </Button>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default MarketingMaterial;
