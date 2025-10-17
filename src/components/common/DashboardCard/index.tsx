import React, { useEffect } from "react";
import { Card, CardBody } from "reactstrap";
import Lottie from "react-lottie-player";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import IphoneImg from "../../../assets/images/iphone.png";
// import IpadImg from "../../../assets/images/Ipad.png";
// import AirPodsImg from "../../../assets/images/Airpods.png";
import CoinImg from "../../../assets/images/price_coin.png";
// import { useTheme } from "@mui/material/styles";
// import { useMediaQuery } from "@mui/material";
import "./style.css";
import { Button } from "@mui/material";

interface Badge {
  type: string;
  label: string;
  value?: any;
  isActive: boolean;
  onClick: () => void;
}

interface ClientData {
  total: number;
  direct: number;
  indirect: number;
}

const selectedStyle = {
  bgcolor: "#11395C",
  color: "#fff",
  // borderRadius: "7px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  // fontSize: "5px",
};

const nonSelectedStyle = {
  bgcolor: "#ABC4DA",
  color: "#11395C",
  // borderRadius: "7px",
  fontFamily: "Poppins",
  borderColor: "#ABC4DA",
  // fontSize: "10px",
};

interface DashboardCardProps {
  title: string;
  value?: number | string;
  subHeading?: string;
  animationData?: any;
  prefix?: string;
  suffix?: string;
  badges?: Badge[];
  note?: any;
  decimals?: any;
  formatIndianNumber?: (value: number) => string;
  customClass?: any;
  activeClients?: any;
  activeClientsEmpty?: any;
  rightTitle?: string;
  rightValue?: number | string;
  rightSubHeading?: string;
  cardStyle?: any;
  // isCustomRender?: any;
  activeClient?: ClientData;
  uniqueTradedClient?: ClientData;
  newAccData?: ClientData;
  upcomingDormantAccountData?: ClientData;
  selectedButton?: any;
  setSelectedButton?: any;
  mainCustomClass?: any;
  activeMenu?: any;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  animationData,
  prefix = "",
  suffix = "",
  badges,
  note,
  formatIndianNumber,
  decimals,
  customClass,
  activeClients,
  activeClientsEmpty,
  rightTitle,
  rightValue,
  cardStyle,
  subHeading,
  rightSubHeading,
  // isCustomRender,
  activeClient,
  uniqueTradedClient,
  newAccData,
  upcomingDormantAccountData,
  selectedButton,
  setSelectedButton,
  mainCustomClass,
  activeMenu,
}) => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const goldOptions: any = [
    "1 GM Gold Coin",
    "2 GM Gold Coin",
    "3 GM Gold Coin",
    "5 GM Gold Coin",
    "Half GM Gold Coin",
  ];

  const activeClientss = { total: 39011, direct: 15351, indirect: 23660 };
  const uniqueTradedClients = { total: 0, direct: 0, indirect: 0 };
  const newAccDatas = { total: 0, direct: 0, indirect: 0 };
  const upcomingDormantAccountDatas = {
    total: 395,
    direct: 228,
    indirect: 167,
  };

  const allDataSets = [
    { title: "Active Clients", data: activeClientss },
    { title: "Unique Traded Clients", data: uniqueTradedClients },
    { title: "New Accounts", data: newAccDatas },
    { title: "Upcoming Dormant Accounts", data: upcomingDormantAccountDatas },
  ].filter((item) => item.data); // only keep ones with data

  console.log("testsrta", allDataSets);

  useEffect(() => {
    console.log(
      "TesttestTest",
      activeClient?.total,
      activeClient?.direct,
      activeClient?.indirect
      // uniqueTradedClient,
      // newAccData,
      // upcomingDormantAccountData
    );
  }, [
    activeClient,
    uniqueTradedClient,
    newAccData,
    upcomingDormantAccountData,
  ]);

  return (
    <>
      <Card
        className="card-animate position-relative shadow-card custom-card"
        style={{
          width: "100%",
          maxWidth: "500px",
          overflow: "hidden",
          marginBottom: "20px",
          height:
            title === "Prize*"
              ? "100px"
              : title === "Revenue Achieved*"
              ? "3.5rem"
              : title === "Client Target*"
              ? "3.5rem"
              : title === "Clients Achieved*"
              ? "3.5rem"
              : "6.8rem",
          minHeight: title === "Prize*" ? "110px" : "auto",
          ...cardStyle,
        }}
      >
        <CardBody>
          {rightTitle || rightValue ? (
            <div className="d-flex justify-content-between align-items-center">
              <h6
                style={{
                  color: "#1B1B1B",
                  fontSize: title.toLowerCase().startsWith("fresh cash margin")
                    ? "12px"
                    : "14px",
                  fontWeight: "bold",
                }}
              >
                {title}
              </h6>
              <h6
                style={{
                  color: "#1B1B1B",
                  fontSize: title.toLowerCase().startsWith("fresh cash margin")
                    ? "12px"
                    : "14px",
                  fontWeight: "bold",
                  marginLeft:
                    rightTitle === "Insurance Achieved" ? "2rem" : "0rem",
                }}
              >
                {rightTitle}
              </h6>
            </div>
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              {/* Left side heading */}
              <h6
                className={
                  title === "Fresh Cash Margin*" ? "fs-12 mb-0" : "fs-12 mb-0"
                }
                style={{
                  textAlign: "left",
                  color: "#1B1B1B",
                  fontWeight: "bold",
                }}
              >
                {title}
              </h6>
              {[
                "Revenue Achieved*",
                "Client Target*",
                "Clients Achieved*",
              ].includes(title) && (
                <h5
                  className="mb-0"
                  style={{
                    color: "#1B1B1B",
                    fontSize: "17px",
                    fontWeight: "bold",
                    width: rightValue === "Coming Soon" ? "6rem" : undefined,
                  }}
                >
                  {prefix}
                  {typeof value === "number" ? (
                    <CountUp
                      start={0}
                      end={value ?? 0}
                      separator=","
                      decimals={decimals}
                      prefix=""
                      duration={1}
                      formattingFn={formatIndianNumber}
                    />
                  ) : (
                    title !== "Prize*" && <span>{value}</span>
                  )}
                  <small
                    className="fs-12"
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {suffix}
                  </small>
                </h5>
              )}
              {/* Right side tabs */}
              {customClass &&
                (title === "Unique Traded Clients" ||
                  title === "New Accounts Added") && (
                  <div className="d-flex gap-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedButton("MTD")}
                      sx={{
                        minWidth: "15px",
                        height: "16px",
                        fontSize: "10px",
                        padding: "0 6px",
                        ...(selectedButton === "MTD"
                          ? selectedStyle
                          : nonSelectedStyle),
                      }}
                    >
                      MTD
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedButton("YTD")}
                      sx={{
                        minWidth: "15px",
                        height: "16px",
                        fontSize: "10px",
                        padding: "0 6px",
                        ...(selectedButton === "YTD"
                          ? selectedStyle
                          : nonSelectedStyle),
                      }}
                    >
                      YTD
                    </Button>
                  </div>
                )}
            </div>
          )}
          <div
            className={`d-grid ${
              rightTitle || rightValue ? "grid-template-columns" : ""
            }`}
            style={{
              display: "grid",
              gridTemplateColumns:
                rightTitle || rightValue ? "1fr auto 1fr" : "1fr",
              alignItems: "center",
              marginTop: !customClass ? "1.5rem" : "0rem",
              marginBottom: customClass ? "1rem" : "0rem",
            }}
          >
            {/* Left Side */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                className="d-flex align-items-center gap-2"
                style={{
                  justifyContent: "space-between",
                }}
              >
                {title === "Prize*" ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {/* Left: Value */}
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        color: "#1B1B1B",
                        textAlign: "left",
                        maxWidth: "60%",
                        wordBreak: "break-word",
                      }}
                    >
                      {value}
                    </div>

                    {/* Right: Image */}
                    <div
                      style={{
                        width: 100,
                        height: 40,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          value === "Iphone 16"
                            ? IphoneImg
                            : goldOptions.includes(value)
                            ? CoinImg
                            : ""
                        }
                        alt=""
                        style={{
                          marginTop: value === "Iphone 16" ? "5rem" : "9rem",
                          height: value === "Iphone 16" ? "270px" : "150px",
                          objectFit: "contain",
                          marginRight: value !== "Iphone 16" ? "4rem" : "0rem",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  title !== "Client Target*" &&
                  activeMenu?.trim().toLowerCase() !== "employee target" && (
                    <Lottie
                      loop
                      play
                      animationData={animationData}
                      style={{ width: 30, height: 30 }}
                    />
                  )
                )}

                {/* {title === "Prize*" ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        color: "#1B1B1B",
                        textAlign: "left",
                        maxWidth: "60%",
                        wordBreak: "break-word",
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        width: 100,
                        height: 40,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={
                          value === "Iphone 16"
                            ? IphoneImg
                            : goldOptions.includes(value)
                            ? CoinImg
                            : ""
                        }
                        alt=""
                        style={{
                          // width: "100%",
                          marginTop: value === "Iphone 16" ? "5rem" : "9rem",
                          height: value === "Iphone 16" ? "270px" : "150px",
                          objectFit: "contain",
                          // marginBottom: "1rem",
                          marginRight: value !== "Iphone 16" ? "4rem" : "0rem",
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <Lottie
                    loop
                    play
                    animationData={animationData}
                    style={{ width: 40, height: 40 }}
                  />
                )} */}
                {!mainCustomClass &&
                  title !== "Revenue Achieved*" &&
                  title !== "Client Target*" &&
                  title !== "Clients Achieved*" && (
                    <div>
                      <h5
                        className="mb-0"
                        style={{
                          color: "#1B1B1B",
                          fontSize: "17px",
                          fontWeight: "bold",

                          width:
                            rightValue === "Coming Soon" ? "6rem" : undefined,
                        }}
                      >
                        {prefix}
                        {typeof value === "number" ? (
                          <CountUp
                            start={0}
                            end={value ?? 0}
                            separator=","
                            decimals={decimals}
                            prefix=""
                            duration={1}
                            formattingFn={formatIndianNumber}
                          />
                        ) : (
                          title !== "Prize*" && <span>{value}</span>
                        )}
                        <small
                          className="fs-12"
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {suffix}
                        </small>
                      </h5>
                    </div>
                  )}
              </div>
              <p
                style={{
                  color: "#095192",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                {subHeading}
              </p>
            </div>

            {/* Divider */}
            {(rightTitle || rightValue) && (
              <div
                style={{
                  width: "1px",
                  height: "40px",
                  backgroundColor: "green",
                  margin: "0 15px",
                }}
              />
            )}
            {(rightTitle || rightValue) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="text-end"
                    style={{
                      width: rightValue === "Coming Soon" ? "4rem" : undefined,
                    }}
                  >
                    {typeof rightValue === "number" ? (
                      <span
                        style={{
                          color: "#1B1B1B",
                          fontWeight: "bold",
                        }}
                      >
                        <CountUp
                          start={0}
                          end={rightValue ?? 0}
                          separator=","
                          duration={1}
                          formattingFn={formatIndianNumber}
                        />
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#1B1B1B",
                          fontWeight: "bold",
                        }}
                      >
                        {rightValue}
                      </span> //  Fix: Wrap in a JSX element
                    )}
                  </div>
                </div>
                <p
                  style={{
                    color: "#ff6e00",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {rightSubHeading}
                </p>
              </div>
            )}
          </div>

          {activeClients !== undefined && activeClients !== null && (
            <div
              className="position-absolute"
              style={{
                bottom: "10px",
                left: "10px",
                zIndex: 1,
                fontFamily: "Public Sans",
              }}
            >
              <Link
                to="#"
                className="badge bg-success-subtle text-success badge-border small px-2 py-1"
                style={{ fontFamily: "Public Sans" }}
              >
                Total Active Clients -{" "}
                {new Intl.NumberFormat("en-IN").format(activeClients)}
              </Link>
            </div>
          )}
          {activeClientsEmpty && (
            <div
              className="position-absolute"
              style={{
                bottom: "10px",
                left: "10px",
                zIndex: 1,
                fontFamily: "Public Sans",
              }}
            ></div>
          )}

          {/* Badges */}
          {badges && (
            <>
              {mainCustomClass ? (
                <div
                  className={`position-absolute ${
                    customClass
                      ? "d-flex justify-content-center align-items-start"
                      : ""
                  }`}
                  style={{
                    bottom: "10px",
                    zIndex: 1,
                    fontFamily: "Public Sans",
                  }}
                >
                  <div className="d-flex">
                    {badges.map((badge, index) => (
                      <React.Fragment key={badge.label}>
                        <div
                          className={
                            customClass
                              ? "d-flex flex-column align-items-center"
                              : ""
                          }
                        >
                          {/* Badge Value */}
                          {badge.value !== undefined && (
                            <h5
                              style={{
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginBottom: "2px",
                              }}
                            >
                              {typeof badge.value === "number" ? (
                                <CountUp
                                  start={0}
                                  end={badge.value as number}
                                  separator=","
                                  duration={1}
                                />
                              ) : (
                                badge.value
                              )}
                            </h5>
                          )}

                          {/* Badge */}
                          <span
                            className={`badge bg-warning text-white badge-border small px-2 py-1`}
                            // onClick={badge.onClick} // optional
                          >
                            {badge.label}
                          </span>
                        </div>

                        {/* Divider */}
                        {customClass && index < badges.length - 1 && (
                          <div
                            style={{
                              width: "1px",
                              height: "40px",
                              backgroundColor: "#ccc",
                              margin: "0 10px",
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="position-absolute"
                  style={{
                    bottom: "10px",
                    zIndex: 1,
                    fontFamily: "Public Sans",
                  }}
                >
                  {badges.map((badge, index) => (
                    <React.Fragment key={badge.type}>
                      <Link
                        to="#"
                        className={`badge ${
                          badge.isActive
                            ? `bg-${badge.type} text-white`
                            : `bg-${badge.type}-subtle text-${badge.type}`
                        } badge-border small px-2 py-1`}
                        onClick={badge.onClick}
                      >
                        {badge.label}
                      </Link>
                      {/* Add space except after the last badge */}
                      {index < badges.length - 1 && <span>&nbsp;</span>}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>{" "}
      {/* Note */}
      {note && (
        <div
          style={{
            // marginTop: "5px", // small spacing below the card
            textAlign: "left",
            color: "#6c757d",
            fontSize: "12px",
            fontFamily: "Public Sans",
            marginLeft: "5px", // align with card padding
          }}
        >
          {note}
        </div>
      )}
    </>
  );
};

export default DashboardCard;
