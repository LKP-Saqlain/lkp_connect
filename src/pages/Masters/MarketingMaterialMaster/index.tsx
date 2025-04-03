import React, { useRef, useState } from "react";
import { Card, CardBody, CardHeader, Button, Input } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import ShowToast from "../../../utils/toastUtils"; // Assuming ShowToast is available

const MasterMenuMarketing = () => {
  const isMobile = useMediaQuery("(max-width:800px)");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Formik and Yup setup for the marketing form
  const formik = useFormik({
    initialValues: {
      description: "",
      fileUpload: "",
      image: "",
    },
    validationSchema: Yup.object({
      fileUpload: Yup.mixed().required("Please upload a marketing file."),
      description: Yup.string().required(
        "Please provide a description for your marketing campaign."
      ),
      image: Yup.mixed().required("Please upload an image for the campaign."),
    }),
    onSubmit: (values) => {
      console.log("Form Values:", values);
      ShowToast("success", "Marketing campaign submitted successfully!");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setUploadedFile(file);
      formik.setFieldValue("fileUpload", file.name);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setUploadedImage(file);
      formik.setFieldValue("image", file.name);
    }
  };

  return (
    <div>
      <div className="page-content">
        <div className="container-fluid">
          <Card style={{ minHeight: "80vh" }}>
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
                >
                  <Input
                    name="uploadProof"
                    innerRef={fileInputRef}
                    type="file"
                    accept=".doc,.docx,.pdf,.xls,.xlsx,.jpg,.jpeg"
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedFile(file); // Save file to uploadedFile state
                        formik.setFieldValue("uploadProof", file.name);
                        formik.setFieldError("uploadProof", "");
                      }
                    }}
                    style={{ width: "30%" }}
                  />
                  <Box flex="1">
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
                      placeholder=" Description"
                      style={{ width: "100%" }}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div style={{ color: "red" }}>
                          {formik.errors.description}
                        </div>
                      )}
                  </Box>
                  <Input
                    name="uploadProof"
                    innerRef={fileInputRef}
                    type="file"
                    accept=".heic,.jpg,.jpeg"
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedFile(file); // Save file to uploadedFile state
                        formik.setFieldValue("uploadProof", file.name);
                        formik.setFieldError("uploadProof", "");
                      }
                    }}
                    style={{ width: "30%" }}
                  />
                </Box>

                <Box textAlign={isMobile ? "center" : "left"} mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{
                      width: isMobile ? "100%" : "20%",
                      backgroundColor: "#11395C",
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
    </div>
  );
};

export default MasterMenuMarketing;
