import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import DataTable from "../../components/common/UserInfoTable";
import { monthlyDataO } from "../../helper/commmon";

const ComChecker = ({ activeSubItem }: any) => {
  useEffect(() => {
    console.log("dd",monthlyDataO);
  }, []);

  return (
    <Card>
      <CardHeader style={{ display: "flex" }}>
        <h4 className="card-title mb-0">Communication Checker</h4>
      </CardHeader>
      <CardBody>
        <DataTable activeSubItem={activeSubItem} T6Data={monthlyDataO} />
      </CardBody>
    </Card>
  );
};

export default ComChecker;
