import { Card, CardBody } from "reactstrap";
import "./style.css";
import React from "react";
import { Link } from "react-router-dom";

interface MonthRow {
  month: string;
  direct: number;
  indirect: number;
}

interface Props {
  title: string;
  rows: MonthRow[];
  total?: { direct: number; indirect: number };
}

const formatValue = (value: number, title: string) => {
  if (title === "Zone Target Achieved %") {
    return `${value.toFixed(2)}%`;
  }

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const ZoneMetricTableCard = ({ title, rows, total }: Props) => {
  return (
    <Card className="h-100">
      <CardBody>
        <h6 className="fw-semibold mb-3">{title}</h6>

        <div className="zone-table">
          {/* Header */}
          <div className="zone-row zone-header">
            <div className="zone-cell month">
              <React.Fragment>
                <Link
                  to="#"
                  className={`badge ${`text-white`} badge-border small px-3 py-1`}
                  style={{ backgroundColor: "#11395C" }}
                >
                  {"Month"}
                </Link>
              </React.Fragment>
            </div>
            <div className="zone-cell direct">
              {" "}
              <React.Fragment>
                <Link
                  to="#"
                  className={`badge ${`text-white`} badge-border small px-3 py-1`}
                  style={{ backgroundColor: "#11395C" }}
                >
                  {"Direct"}
                </Link>
              </React.Fragment>
            </div>
            <div className="zone-cell indirect">
              <React.Fragment>
                <Link
                  to="#"
                  className={`badge ${`text-white`} badge-border small px-3 py-1`}
                  style={{ backgroundColor: "#11395C" }}
                >
                  {"Indirect"}
                </Link>
              </React.Fragment>
            </div>
          </div>

          {/* Body */}
          {rows.map((row) => (
            <div key={row.month} className="zone-row">
              <div className="zone-cell month">
                <React.Fragment>
                  <Link
                    to="#"
                    className={`badge ${`bg-warning text-white`} badge-border small px-2 py-1`}
                  >
                    {row.month}{" "}
                  </Link>
                </React.Fragment>
              </div>
              <div className="zone-cell direct">
                {title === "Zone Target Achieved %"
                  ? `${row.direct.toLocaleString("en-IN")}%`
                  : row.direct.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
              </div>
              <div className="zone-cell indirect">
                {/* {row.indirect.toLocaleString("en-IN ")}  */}
                {title === "Zone Target Achieved %"
                  ? `${row.indirect.toLocaleString("en-IN")}%`
                  : row.indirect.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
              </div>
            </div>
          ))}

          <div className="zone-row zone-total">
            <div className="zone-cell month">
              {" "}
              <React.Fragment>
                <Link
                  to="#"
                  className={`badge ${`text-white`} badge-border small px-2 py-1`}
                  style={{ backgroundColor: "#11395C" }}
                >
                  {"Total"}
                </Link>
              </React.Fragment>
            </div>
            <div className="zone-cell direct">
              {total && formatValue(total.direct, title)}
            </div>

            <div className="zone-cell indirect">
              {total && formatValue(total.indirect, title)}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ZoneMetricTableCard;
