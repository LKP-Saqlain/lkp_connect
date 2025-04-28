// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import { cardDetails } from "../../helper/tableColumns.tsx";
// import { useTheme, useMediaQuery } from "@mui/material";
// import { Button, Card, CardBody, CardHeader } from "reactstrap";
// import { useEffect } from "react";
// import { hideLoader, showLoader } from "../../redux/slices/loaderSlice.ts";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../redux/store.ts";
// import { apiServices } from "../../services/index.ts";

// const MarketingMaterial = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     console.log("marketing check");
//     const fetchMarketingMaterial = async () => {
//       dispatch(showLoader("please wait"));
//       try {
//         const response = await apiServices.ViewMarketingMaterials({});
//         console.log("Fetched marketing materials:", response?.data?.Table);
//       } catch (error) {
//         console.error("Error fetching marketing materials:", error);
//       } finally {
//         dispatch(hideLoader());
//       }
//     };
//     fetchMarketingMaterial();
//   }, []);

//   return (
//     <Card>
//       <CardHeader>
//         <h4 className="card-title mb-0">Marketing Materials</h4>
//       </CardHeader>
//       <CardBody style={{ minHeight: "75vh" }}>
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             justifyContent: isMobile ? "center" : "",
//           }}
//         >
//           {cardDetails.map((card: any) => (
//             <Card
//               key={card.id}
//               style={{
//                 width: isMobile ? "100%" : "200px",
//                 margin: "5px",
//                 padding: "10px",
//                 borderRadius: "16px",
//                 marginBottom: isMobile ? "12px" : "0px",
//                 // backgroundColor:"##11395C",
//                 boxShadow: isMobile
//                   ? "0 6px 12px rgba(0, 0, 0, 0.3)" // Darker shadow for mobile
//                   : "0 12px 24px rgba(0, 0, 0, 0.4)", // Darker shadow for desktop
//               }}
//             >
//               <CardMedia
//                 component="img"
//                 image={card.imageUrl}
//                 alt={card.title}
//                 sx={{ height: 120, objectFit: "cover" }}
//               />
//               <CardContent>
//                 <Typography
//                   style={{
//                     fontSize: isMobile ? 10 : 12,
//                     color: "#11395C",
//                     fontWeight: "bold",
//                     textAlign: "center",
//                   }}
//                 >
//                   {card.title}
//                 </Typography>
//               </CardContent>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 style={{
//                   backgroundColor: "#11395C",
//                   fontWeight: "bold",
//                   textTransform: "none",
//                 }}
//                 href={card.pdfUrl}
//                 target="_blank"
//                 download={card.title}
//                 disabled={!card.pdfUrl}
//               >
//                 {card.pdfUrl ? "Download" : "No PDF Available"}
//               </Button>
//             </Card>
//           ))}
//         </div>
//       </CardBody>
//     </Card>
//   );
// };

// export default MarketingMaterial;
import { useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Card, CardBody, CardHeader, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store.ts";
import { apiServices } from "../../services/index.ts";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice.ts";
// import { ShowToast } from "../components/Toast/Toast"; // Update import as needed

// Base URL to access your files (adjust as per your file server setup)
const FILE_BASE_URL = "http://yourserver.com/files/"; // <-- change this

const MarketingMaterial = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  const [materials, setMaterials] = useState<any[]>([]);

  useEffect(() => {
    const fetchMarketingMaterial = async () => {
      dispatch(showLoader("Please wait..."));
      try {
        const response = await apiServices.ViewMarketingMaterials({});
        const data = response?.data?.Table || [];

        const transformed = data.map((item: any, index: number) => {
          const imageName = item.UploadImages?.split("\\").pop();
          const pdfName = item.UploadDocuments?.split("\\").pop();

          return {
            id: item.RowId || index,
            title: item.Description || "Untitled",
            imageUrl: imageName ? FILE_BASE_URL + imageName : "",
            pdfUrl: pdfName ? FILE_BASE_URL + pdfName : "",
          };
        });

        setMaterials(transformed);
      } catch (error) {
        console.error("Error fetching marketing materials:", error);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchMarketingMaterial();
  }, [dispatch]);

  const handleDownload = async (row: any) => {
    const fileNameWithExt = row.pdfUrl?.split("/").pop(); // e.g., "file.pdf"
    const [fileNameWithoutExt = "", fileExt = ""] =
      fileNameWithExt?.split(".") || [];

    const payload = {
      fileName: fileNameWithoutExt,
      filePath: "D:\\PROJECT\\",
      fileType: `.${fileExt}`,
      contentType: "",
    };

    dispatch(showLoader("Downloading..."));

    try {
      const response = await apiServices.ComplianceDownload(payload);
      if (response?.status === 200 && response?.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileNameWithExt);
        document.body.appendChild(link);
        link.click();
      } else {
        // ShowToast("info", "Error downloading file");
      }
    } catch (error: any) {
      // ShowToast(
      //   "info",
      //   error?.message || "An error occurred while downloading"
      // );
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <Card>
      <CardHeader>
        <h4 className="card-title mb-0">Marketing Materials</h4>
      </CardHeader>
      <CardBody style={{ minHeight: "75vh" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "",
          }}
        >
          {materials.map((card: any) => (
            <Card
              key={card.id}
              style={{
                width: isMobile ? "100%" : "200px",
                margin: "5px",
                padding: "10px",
                borderRadius: "16px",
                marginBottom: isMobile ? "12px" : "0px",
                boxShadow: isMobile
                  ? "0 6px 12px rgba(0, 0, 0, 0.3)"
                  : "0 12px 24px rgba(0, 0, 0, 0.4)",
              }}
            >
              <CardMedia
                component="img"
                image={card.imageUrl}
                alt={card.title}
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
                  {card.title}
                </Typography>
              </CardContent>
              <Button
                onClick={() => handleDownload(card)}
                style={{
                  backgroundColor: "#11395C",
                  fontWeight: "bold",
                  textTransform: "none",
                  width: "100%",
                }}
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
