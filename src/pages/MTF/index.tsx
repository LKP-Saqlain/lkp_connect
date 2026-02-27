import { Box } from "@mui/material";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import Logo from "../../assets/logo.png";
import TermsAndConditions from "./termsConditions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
// import OTPConsent from "./consentOtp";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { apiServices } from "../../services";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MTFActivation = () => {
  const [tnc, setTnc] = useState(false);
  const navigate = useNavigate();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleChechbox = (value: any) => {
    console.log("Value1332222", value);
    setTnc(value);
  };

  const handleOtpPage = () => {
    const payload = {
      user_id: user_id,
      clientCode: "MT0600508",
      hasAcceptedTerms: tnc,
    };
    dispatch(showLoader(""));

    apiServices
      .BeginMTFActivation(payload)
      .then((response) => {
        if (response?.status === 201) {
          console.log("succesApi", response?.data?.data);
          navigate("/otp");
        }
      })
      .catch((error) => {
        console.log("Errrror", error);
        dispatch(hideLoader());
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <>
      <div className="page-content page-view">
        <div className="container-fluid">
          <Row className="row-font">
            <Col style={{ marginLeft: "10px" }}>
              <Card
                style={{
                  minHeight: "85vh",
                  borderRadius: "20px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  margin: "1rem .5rem",
                }}
              >
                <CardHeader
                  style={{
                    borderRadius: "20px 20px 0 0",
                    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "rgb(238, 238, 238)",
                    padding: "0.5rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <h4
                      className="mb-0"
                      style={{
                        color: "#01396B",
                        fontSize: "22px",
                        fontWeight: "bold",
                      }}
                    >
                      Margin Trading Facility
                    </h4>
                  </Box>

                  <img
                    src={Logo}
                    alt="Logo"
                    style={{ height: "50px", margin: ".2rem" }}
                  />
                </CardHeader>
                <CardBody
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <TermsAndConditions
                    handleChechbox={handleChechbox}
                    handleOtpPage={handleOtpPage}
                  />
                  {/* <OTPConsent /> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default MTFActivation;
