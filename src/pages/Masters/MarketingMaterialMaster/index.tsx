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
      description: Yup.string().required("Please provide a description."),
      image: Yup.mixed().required("Please upload an image."),
    }),
    onSubmit: (values) => {
      if (!uploadedFile || !uploadedImage) {
        ShowToast("error", "Please upload both document and image files.");
        return;
      }

      const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64 = (reader.result as string).split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
        });
      };

      Promise.all([
        readFileAsBase64(uploadedFile),
        readFileAsBase64(uploadedImage),
      ])
        .then(([docBase64, imgBase64]) => {
          const payload = {
            options: "INSERT",
            rowId: 0,
            uploadDocumentsBase64: docBase64,
            documentFileName: uploadedFile.name,
            uploadImagesBase64: imgBase64,
            imageFileName: uploadedImage.name,
            description: values.description,
          };

          return apiServices.getInUpMarketMaterial(payload);
        })
        .then((response) => {
          if (response?.status === 200) {
            ShowToast("success", "Marketing materials uploaded successfully!");
            formik.resetForm();
            setUploadedFile(null);
            setUploadedImage(null);
          } else {
            throw new Error("Upload failed.");
          }
        })
        .catch((error) => {
          console.error("Error submitting materials:", error);
          ShowToast("error", "There was an error submitting the materials.");
        });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedFileFormats.includes(fileExt)) {
        formik.setFieldError(
          "fileUpload",
          "Invalid format! Only pdf, ppt, pptx allowed."
        );
        setUploadedFile(null);
        return;
      }

      setUploadedFile(file);
      formik.setFieldValue("fileUpload", file.name);
      formik.setFieldError("fileUpload", "");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
      if (!allowedImageFormats.includes(fileExt)) {
        formik.setFieldError(
          "image",
          "Invalid format! Only jpg, jpeg, png allowed."
        );
        setUploadedImage(null);
        return;
      }

      setUploadedImage(file);
      formik.setFieldValue("image", file.name);
      formik.setFieldError("image", "");
    }
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
