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
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ShowToast from "../../utils/toastUtils";
import { mtfClientDetails } from "../../redux/slices/mtf/mtfClientSlice";
type ClientDetails = {
  cc: string;
  cn: string;
  mob: string;
  mail: string;
};

const MTFActivation = () => {
  const [tnc, setTnc] = useState(false);
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(
    null
  );
  const navigate = useNavigate();
  const { user_id } = useSelector(
    (state: RootState) => state.UserLogin?.data?.data
  );
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const clientCode = location.search.replace("?", "");

  useEffect(() => {
    if (!clientCode) return;

    const payload = {
      clientCode: clientCode,
    };

    dispatch(showLoader(""));

    apiServices
      .GetMTFClientDetails(payload)
      .then((response) => {
        if (response?.status === 200) {
          const data = response?.data?.data;
          console.log("Response112", data);
          setClientDetails(data);
          dispatch(mtfClientDetails(data));
          navigate("/MTFSegmentActivation", { replace: true });
        }
      })
      .catch((error) => {
        console.log("Error", error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  }, [clientCode]);

  const handleChechbox = (value: any) => {
    console.log("Value1332222", value);
    setTnc(value);
  };

  const handleOtpPage = () => {
    if (!clientDetails) return;

    const payload = {
      user_id: user_id,
      clientCode: clientDetails.cc,
      hasAcceptedTerms: tnc,
    };
    dispatch(showLoader(""));

    apiServices
      .BeginMTFActivation(payload)
      .then((response) => {
        if (response?.status === 200) {
          console.log("succesApi", response?.data);
          ShowToast("success", response?.data?.message);
          // navigate("/otp");
          navigate(`/otp?${clientDetails?.cc}`);
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
                    clientDetails={clientDetails}
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
