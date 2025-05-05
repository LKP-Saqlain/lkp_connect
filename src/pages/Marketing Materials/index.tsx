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

const MarketingMaterial = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch<AppDispatch>();

  const [materials, setMaterials] = useState<any[]>([]);
  // const base64test =
  //   "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";
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
            imageUrl: imageName || "",
            pdfUrl: pdfName || "",
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
              {/* <CardMedia
                component="img"
                alt="Marketing Material"
                image={`data:image/jpeg;base64,${base64test}`} // or image/png if it's a PNG
                style={{ maxHeight: 300, objectFit: "contain" }}
              /> */}

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
