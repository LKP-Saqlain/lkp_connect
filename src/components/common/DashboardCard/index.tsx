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
  value?: number | string;
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
  rightTitle?: string;
  rightSubtitle?: number;
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
  rightSubtitle,
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
          // borderRadius: "15px",
          // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <CardBody>
          {rightTitle && rightSubtitle ? (
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fs-14 mb-0">{title}</h6>
              <h6
                className="fs-14 mb-0"
                style={{
                  color: "#1B1B1B",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                {rightTitle}
              </h6>
            </div>
          ) : (
            <h6 className="fs-14 mb-0">{title}</h6>
          )}
          <div
            className={`d-flex justify-content-between align-items-center ${
              rightTitle || rightSubtitle ? "flex-row" : ""
            }`}
            style={{
              marginTop: !customClass ? "1.5rem" : "0rem",
              marginBottom: customClass ? "1rem" : "0rem",
            }}
          >
            {/* Left Side */}
            <div
              className="d-flex align-items-center gap-2"
              style={{ flex: 1 }}
            >
              <Lottie
                loop
                play
                animationData={animationData}
                style={{ width: 40, height: 40 }}
              />
              <div>
                <h5
                  className="mb-0"
                  style={{
                    color: "#1B1B1B",
                    fontSize: "17px",
                    fontWeight: "bold",
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
                    <span>{value}</span>
                  )}
                  <small
                    className="fs-12"
                    style={{
                      fontWeight: "bold",
                      marginLeft: "10px",
                    }}
                  >
                    {suffix}
                  </small>
                </h5>
              </div>
            </div>
            {(rightTitle || rightSubtitle) && (
              <div
                style={{
                  width: "1px",
                  height: "40px",
                  backgroundColor: "#DCDCDC",
                  margin: "0 15px",
                }}
              />
            )}
            {(rightTitle || rightSubtitle) && (
              <div className="d-flex align-items-center gap-2">
                <Lottie
                  loop
                  play
                  animationData={animationData}
                  style={{ width: 40, height: 40 }}
                />

                <div className="text-end">
                  {typeof rightSubtitle === "number" && (
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#1B1B1B",
                        fontWeight: "bold",
                      }}
                    >
                      <CountUp
                        start={0}
                        end={rightSubtitle}
                        separator=","
                        duration={1}
                        formattingFn={(val: number) =>
                          `${val.toLocaleString("en-IN")}`
                        }
                      />
                    </span>
                  )}
                </div>
              </div>
            )}
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
          <span style={{ fontFamily: "Public Sans" }}>{note}</span>
        </div>
      )}
    </>
  );
};

export default DashboardCard;
