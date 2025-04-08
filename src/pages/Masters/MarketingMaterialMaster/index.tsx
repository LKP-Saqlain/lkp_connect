import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button, Input } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import { Typography, useMediaQuery } from "@mui/material";
import ShowToast from "../../../utils/toastUtils"; // Assuming ShowToast is available
import { apiServices } from "../../../services";

// Define allowed file extensions for validation
const allowedFileFormats = ["pdf", "ppt", "pptx"];
const allowedImageFormats = ["jpg", "jpeg", "png"];

const MasterMenuMarketing = () => {
  const isMobile = useMediaQuery("(max-width:800px)");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const formik = useFormik({
    initialValues: {
      description: "",
      fileUpload: "",
      image: "",
    },
    validationSchema: Yup.object({
      fileUpload: Yup.mixed().required("Please upload a marketing file."),
      description: Yup.string().required(
        "Please provide a description for your marketing file."
      ),
      image: Yup.mixed().required("Please upload an image for the marketing."),
    }),
    onSubmit: (values) => {
      console.log("Form Values:", values);

      // Handle file and image uploads sequentially
      handleFileUploadAsync(uploadedFile, "marketingFile")
        .then(() => handleFileUploadAsync(uploadedImage, "marketingImage"))
        .then(() => {
          // Reset form after successful submission
          console.log("before", uploadedFile);
          formik.resetForm();
          setUploadedFile(null);
          setUploadedImage(null); // Reset image state too
          console.log("after", uploadedFile);
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          ShowToast("error", "There was an error submitting the materials.");
        });
    },
  });

  // Handle file change (for the marketing material)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

      if (!allowedFileFormats.includes(fileExt)) {
        // Show error message using formik
        formik.setFieldError(
          "fileUpload",
          "Invalid file format! Allowed formats: pdf, ppt, pptx."
        );
        setUploadedFile(null); // Reset uploaded file
        return;
      }

      setUploadedFile(file);
      formik.setFieldValue("fileUpload", file.name);
      formik.setFieldError("fileUpload", ""); // Reset the error if file format is valid
    }
  };

  // Handle image change (for the marketing image)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";

      if (!allowedImageFormats.includes(fileExt)) {
        // Show error message using formik
        formik.setFieldError(
          "image",
          "Invalid image format! Allowed formats: jpg, jpeg, png."
        );
        setUploadedImage(null); // Reset uploaded image
        return;
      }

      setUploadedImage(file);
      formik.setFieldValue("image", file.name);
      formik.setFieldError("image", ""); // Reset the error if image format is valid
    }
  };

  // Generate file name with date and description
  const generateFileName = (fileExt: string, description: string) => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format

    const formattedDate = `${day}_${month}_${year}_${formattedHours}_${minutes}_${seconds}${period}`;
    return `${formattedDate}_${description}_${fileExt}`;
  };

  // Handle file upload API call
  const handleFileUploadAsync = (
    file: File | null,
    fileType: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error("No file provided"));
      }

      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      const allowedFormats =
        fileType === "marketingImage"
          ? allowedImageFormats
          : allowedFileFormats;

      if (!allowedFormats.includes(fileExt)) {
        return reject(new Error(`Invalid ${fileType} format!`));
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Only = base64String.split(",")[1] || base64String;

        // Format the file name using the generateFileName function
        const fileName = generateFileName(fileExt, formik.values.description);

        const payload = {
          fileName: fileName,
          filePath: "D:\\FileUpload\\Compliance", // Example path
          fileType: `.${fileExt}`,
          contentType: base64Only,
        };

        // Simulate API call (Replace with actual API service call)
        apiServices
          .ComplainceFileUpload(payload)
          .then((response) => {
            if (response?.status === 200) {
              ShowToast("success", `File successfully uploaded: ${fileName}`);
              resolve(fileExt);
            } else {
              reject(new Error("File upload failed"));
            }
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
            reject(error);
          });
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        reject(error);
      };
    });
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Card style={{ minHeight: "30vh" }}>
          <CardHeader>
            <h4 className="card-title mb-0">Master Marketing Materials</h4>
          </CardHeader>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                alignItems="flex-start"
                gap="16px"
                width="100%"
              >
                {/* Image Upload Section */}
                <Box flex="1" style={{ width: "100%" }}>
                  <Typography>Upload Images</Typography>
                  <Input
                    name="image"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    onChange={handleImageChange}
                    invalid={
                      formik.touched.image && Boolean(formik.errors.image)
                    }
                  />
                  {formik.touched.image && formik.errors.image && (
                    <div style={{ color: "red" }}>{formik.errors.image}</div>
                  )}
                </Box>
                {/* Description Section */}
                <Box flex="1" style={{ width: "100%" }}>
                  <Typography>Description</Typography>
                  <Input
                    name="description"
                    type="text"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    placeholder="Description"
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div style={{ color: "red" }}>
                      {formik.errors.description}
                    </div>
                  )}
                </Box>

                {/* File Upload Section (Marketing File) */}
                <Box flex="1" style={{ width: "100%" }}>
                  <Typography>Upload Documents</Typography>
                  <Input
                    name="fileUpload"
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    className="form-control"
                    onChange={handleFileChange}
                    invalid={
                      formik.touched.fileUpload &&
                      Boolean(formik.errors.fileUpload)
                    }
                  />
                  {formik.touched.fileUpload && formik.errors.fileUpload && (
                    <div style={{ color: "red" }}>
                      {formik.errors.fileUpload}
                    </div>
                  )}
                </Box>
              </Box>

              {/* Submit Button */}
              <Box textAlign={isMobile ? "center" : "left"} mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: "#11395C",
                    height: "35px",
                  }}
                >
                  Submit
                </Button>
              </Box>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default MasterMenuMarketing;
