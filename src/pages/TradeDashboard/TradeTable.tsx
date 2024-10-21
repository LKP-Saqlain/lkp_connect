import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "./tableContainer";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";

const PaginationTable = () => {
  const paginationTable = [
    {
      id: "#VL2111",
      name: "Jonathan",
      date: "07 Oct, 2021",
      total: "$24.05",
      status: "Paid",
    },
    {
      id: "#VL2110",
      name: "Harold",
      date: "07 Oct, 2021",
      total: "$26.15",
      status: "Paid",
    },
    {
      id: "#VL2109",
      name: "Shannon",
      date: "06 Oct, 2021",
      total: "$21.25",
      status: "Refund",
    },
    {
      id: "#VL2108",
      name: "Robert",
      date: "05 Oct, 2021",
      total: "$25.03",
      status: "Paid",
    },
    {
      id: "#VL2107",
      name: "Noel",
      date: "05 Oct, 2021",
      total: "$22.61",
      status: "Paid",
    },
    {
      id: "#VL2106",
      name: "Traci",
      date: "04 Oct, 2021",
      total: "$24.05",
      status: "Paid",
    },
    {
      id: "#VL2105",
      name: "Kerry",
      date: "04 Oct, 2021",
      total: "$26.15",
      status: "Paid",
    },
    {
      id: "#VL2104",
      name: "Patsy",
      date: "04 Oct, 2021",
      total: "$21.25",
      status: "Refund",
    },
    {
      id: "#VL2103",
      name: "Cathy",
      date: "03 Oct, 2021",
      total: "$22.61",
      status: "Paid",
    },
    {
      id: "#VL2102",
      name: "Tyrone",
      date: "03 Oct, 2021",
      total: "$25.03",
      status: "Paid",
    },
  ];

  const columns = useMemo(
    () => [
      {
        header: "ID",
        cell: (cell: any) => {
          return (
            <Link to="#" className="fw-medium">
              {cell.getValue()}
            </Link>
          );
        },
        accessorKey: "id",
        enableColumnFilter: false,
      },

      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Date",
        accessorKey: "date",
        enableColumnFilter: false,
      },
      {
        header: "Total",
        accessorKey: "total",
        enableColumnFilter: false,
      },
      {
        header: "Status",
        enableColumnFilter: false,
        accessorKey: "status",
        cell: (cell: any) => {
          switch (cell.getValue()) {
            case "Paid":
              return (
                <span className="badge bg-success-subtle text-success text-uppercase">
                  {" "}
                  {cell.getValue()}
                </span>
              );
            case "Refund":
              return (
                <span className="badge bg-warning-subtle  text-warning text-uppercase">
                  {" "}
                  {cell.getValue()}
                </span>
              );
            default:
              return (
                <span className="badge bg-danger-subtle  text-danger text-uppercase">
                  {" "}
                  {cell.getValue()}
                </span>
              );
          }
        },
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        cell: (cell: any) => {
          return <React.Fragment>Details</React.Fragment>;
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <TableContainer
        columns={columns || []}
        data={paginationTable || []}
        customPageSize={5}
        tableClass="table-centered align-middle table-nowrap mb-0"
        theadClass="text-muted table-light"
        SearchPlaceholder="Search Products..."
      />
    </React.Fragment>
  );
};

export { PaginationTable };
