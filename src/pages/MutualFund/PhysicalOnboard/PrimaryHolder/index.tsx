import React from "react";

const PrimaryHolder = ({ data }: any) => {
  if (!data) return null;

  const items = [
    { label: "First Name", value: data.primaryHolderFirstName },
    { label: "Middle Name", value: data.primaryHolderMiddleName },
    { label: "Last Name", value: data.primaryHolderLastName },
    { label: "Gender", value: data.gender },
    { label: "Date of Birth", value: data.primaryHolderDOB },
    { label: "PAN", value: data.primaryHolderPAN },
    { label: "Account Type", value: data.accountType4 },
    { label: "Account Number", value: data.accountNo4 },
    { label: "IFSC Code", value: data.ifscCode4 },
    { label: "Address Line 1", value: data.address1 },
    { label: "Address Line 2", value: data.address2 },
    { label: "Address Line 3", value: data.address3 },
    { label: "City", value: data.city },
    { label: "State", value: data.state },
    { label: "Pincode", value: data.pincode },
    { label: "Country", value: data.country },
    { label: "Email", value: data.email },
    { label: "Mobile", value: data.indianMobileNo },
  ];

  return (
    <div>
      {/* <h3 style={{ marginBottom: "15px" }}>Primary Holder Details</h3> */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "18px",
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              padding: "6px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "#fafafa",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666" }}>{item.label}</div>
            <div
              style={{ fontSize: "12px", fontWeight: 600, marginTop: "2px" }}
            >
              {item.value || "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimaryHolder;
