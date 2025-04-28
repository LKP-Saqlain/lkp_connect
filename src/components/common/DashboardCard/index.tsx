import React from "react";
import { Card, CardBody } from "reactstrap";
import Lottie from "react-lottie-player";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
// import { useTheme } from "@mui/material/styles";
// import { useMediaQuery } from "@mui/material";
import "./style.css";

interface Badge {
  type: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

interface DashboardCardProps {
  title: string;
  value?: number;
  animationData: any;
  prefix?: string;
  suffix?: string;
  badges?: Badge[];
  note?: any;
  decimals?: any;
  formatIndianNumber?: (value: number) => string;
  customClass?: any;
  activeClients?: any;
  activeClientsEmpty?: any;
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
}) => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Card
        className="card-animate position-relative shadow-card custom-card"
        style={{
          width: "100%",
          maxWidth: "500px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <CardBody>
          {/* Title */}
          <h6 className="fs-14">{title}</h6>

          {/* Value and Animation */}
          <div
            className="d-flex align-items-center justify-content-between"
            style={{
              marginTop: !customClass ? "1.5rem" : "0rem",
              marginBottom: customClass ? "1rem" : "0rem",
            }}
          >
            <div className="mr-3">
              <Lottie
                loop={true}
                play
                animationData={animationData}
                style={{ width: 40, height: 40 }}
              />
            </div>
            <div className="text-center">
              <h5
                className="mb-0"
                style={{
                  color: "#1B1B1B",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                {prefix}
                <CountUp
                  start={0}
                  end={value ?? 0}
                  separator=","
                  decimals={decimals}
                  prefix=""
                  duration={1}
                  formattingFn={formatIndianNumber}
                />
                <small
                  className="fs-12"
                  style={{
                    fontWeight: "bold",
                    marginRight: "15px",
                  }}
                >
                  {suffix}
                </small>
              </h5>
            </div>
          </div>
          {activeClients && (
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
            <div
              className="position-absolute"
              style={{
                bottom: "10px",
                // left: "10px",
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
                  {/* Add &nbsp; except after the last badge */}
                  {index < badges.length - 1 && <span>&nbsp;</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
      {/* Note */}
      {note && (
        <div className="movable-note">
          {/* <span style={{ fontFamily: "Public Sans" }}>{note}</span> */}
        </div>
      )}
    </>
  );
};

export default DashboardCard;
