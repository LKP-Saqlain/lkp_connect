import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import UserInfoTable from "../../../components/common/UserInfoTable";
import ShowToast from "../../../utils/toastUtils";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../../redux/slices/loaderSlice";
import { apiServices } from "../../../services";
import { RootState } from "../../../redux/store";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import { Box, Button } from "@mui/material";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface preProofUpload {
  activeSubItem: string;
}

const allowedFormats = ["pdf", "png", "jpg", "jpeg"];

const ProofUpload = ({ activeSubItem }: preProofUpload) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileExtension, setFileExtension] = useState("");
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [getPreTradeRecords, setGetPreTradeRecords] = useState<[]>([]);
  const [uploadApiStatus, setUploadApiStatus] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // const toastShownRef = useRef(false);

  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data,
  );

  useEffect(() => {
    console.log(
      "activeItemCheck->",
      activeSubItem,
      uploadedFile,
      fileExtension,
      fileBase64,
      uploadApiStatus,
      isSubmitted,
    );
  }, [activeSubItem, uploadedFile, fileExtension, fileBase64]);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!selectedDate) {
      ShowToast("error", "Please select a trade date");
      return;
    }

    const payload = {
      option: "View",
      tradedatetime: selectedDate.format("YYYY-MM-DD"),
      userId: user_id, // "EMP-5434",
    };

    dispatch(showLoader("Please wait, we are processing your request..."));

    try {
      const response = await apiServices.GetAllRecords(payload);

      if (response?.status === 200) {
        const rawData = response?.data?.data || [];

        const finalData = rawData
          .filter((item: any) => item !== null)
          .map((item: any, index: number) => ({
            ...item,
            Id: index + 1,
          }));

        setGetPreTradeRecords(finalData);
        setIsSubmitted(true);
      } else {
        setGetPreTradeRecords([]);
        setIsSubmitted(false);

        ShowToast(
          "error",
          response?.data?.message || "Failed to fetch records",
        );
      }
    } catch (error) {
      console.error("GetAllRecords error:", error);
      setGetPreTradeRecords([]);
      setIsSubmitted(false);

      ShowToast("error", "Something went wrong while fetching records");
    } finally {
      dispatch(hideLoader());
    }
  };

  // useEffect(() => {
  //   let payload = {
  //     option: "View",
  //     userId: user_id,
  //   };
  //   dispatch(showLoader("Please wait, we are processing your request..."));
  //   apiServices
  //     .GetAllRecords(payload)
  //     .then((response) => {
  //       console.log("getAllRecordsReponse->", response?.data);
  //       if (response?.status === 200) {
  //         dispatch(hideLoader());
  //         // setGetPreTradeRecords(response?.data?.data);
  //         const rawData = response?.data?.data || [];
  //         const filteredData = rawData.filter((item: any) => {
  //           return item !== null; // replace with your actual filter condition
  //         });
  //         const finalData = filteredData.map((item: any, index: number) => ({
  //           ...item,
  //           Id: index + 1,
  //         }));
  //         console.log("finalFilterData", finalData);

  //         setGetPreTradeRecords(finalData);
  //         // if (!toastShownRef.current) {
  //         //   toastShownRef.current = true;

  //         //   if (response?.data?.data.length === 0) {
  //         //     ShowToast("error", response?.data?.message);
  //         //   } else {
  //         //     ShowToast("success", response?.data?.message);
  //         //   }
  //         // }
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error--->", error);
  //       dispatch(hideLoader());
  //     });
  // }, [dispatch, uploadApiStatus]);

  const handleFileUploadAsync = (
    file: any,
    communicationProofPath: string,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      // debugger;
      if (allowedFormats.includes(fileExt)) {
        const { name } = file;
        const fileName = name.substring(0, name.lastIndexOf("."));
        console.log("fileName", fileName);

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
          const base64String = reader.result as string;
          const base64Only = base64String.split(",")[1] || base64String;

          setUploadedFile(file);
          setFileBase64(base64Only); // Store base64
          setFileExtension(fileExt);

          dispatch(showLoader("Uploading file..."));

          let payload = {
            fileName: communicationProofPath,
            filePath: "D:\\FileUpload\\PreTrade",
            fileType: `.${fileExt}`,
            contentType: base64Only,
          };

          apiServices
            .ComplainceFileUpload(payload)
            .then((response) => {
              dispatch(hideLoader());
              if (response?.status === 200) {
                // ShowToast("success", "File Successfully Uploaded");
                resolve(fileExt); // Resolve the promise on success
              } else {
                reject(new Error("File upload failed"));
              }
            })
            .catch((error) => {
              dispatch(hideLoader());
              console.error("ERROR-->", error);
              reject(error); // Reject the promise on error
            });
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          dispatch(hideLoader());
          reject(error); // Reject the promise on error
        };
      } else {
        alert("Invalid file format! Allowed: DOC, PDF, XLS, XLSX, JPG, JPEG");
        reject(new Error("Invalid file format"));
      }
    });
  };

  const handleFileUpload = async (row: any, file: File, remark: string) => {
    console.log("Uploading file for", row, file, remark);
    const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

    if (!allowedExtensions.includes(fileExt)) {
      ShowToast(
        "error",
        "Please upload a file in JPG, JPEG, PNG, or PDF format.",
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64WithPrefix = reader.result as string;
      const base64Data = base64WithPrefix.split(",")[1];

      if (!base64Data) {
        ShowToast("error", "Failed to process the file.");
        return;
      }
      // const fileNameWithoutExtension = file.name.substring(
      //   0,
      //   file.name.lastIndexOf(".")
      // );
      const fullFileNameWithExtension = file.name;
      const currentTime = dayjs().format("DD/MM/YYYY_hh:mmA");

      const communicationProofPath = `${currentTime}_${fullFileNameWithExtension}`;
      console.log("communicationProofPath", communicationProofPath);

      try {
        await handleFileUploadAsync(file, communicationProofPath);

        const payload = {
          rowId: row?.rid,
          fileName: communicationProofPath,
          uploadedBy: user_id,
          uploadedDate: dayjs()
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DDTHH:mm:ss"),
          remarks: remark,
          user_id,
        };

        console.log("Payload to send:", payload);
        dispatch(showLoader("Please wait for a moment"));
        apiServices
          .UploadTradeFile(payload)
          .then((response) => {
            if (response?.status === 200) {
              dispatch(hideLoader());
              console.log("Response------>", response?.data);
              setUploadApiStatus(true);

              setTimeout(() => {
                setUploadApiStatus(false);
              }, 2000);

              // ShowToast("success", response?.data?.message);
            }
          })
          .catch((error) => {
            console.log("error", error);
            dispatch(hideLoader());
            setUploadApiStatus(false);
          });
      } catch (error) {
        console.error("Compliance Upload Failed:", error);
        ShowToast("error", "Compliance upload failed.");
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      ShowToast("error", "Error reading the file.");
    };

    reader.readAsDataURL(file);
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
              backgroundColor: "#fff", // optional for contrast
            }}
          >
            <h4 className="card-title mb-0">
              PreTrade Confirmation Proof Upload
            </h4>
          </CardHeader>
          <CardBody>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mb: 3,
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Trade Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  maxDate={dayjs()}
                  format="DD-MM-YYYY"
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: { minWidth: 220 },
                    },
                  }}
                />
              </LocalizationProvider>

              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!selectedDate}
                sx={{
                  height: 40,
                  px: 3,
                  borderRadius: "8px",
                  textTransform: "none",
                  backgroundColor: "#11395C",
                  "&:hover": {
                    backgroundColor: "#0C2D62",
                  },
                }}
              >
                Submit
              </Button>
            </Box>
            <UserInfoTable
              activeSubItem={activeSubItem}
              T6Data={getPreTradeRecords}
              onFileUpload={handleFileUpload}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ProofUpload;
