import React from "react";

interface RadioInputProps {
  id: string;
  name: string;
  label: string;
}

const RadioInput: React.FC<RadioInputProps> = ({ id, name, label }) => {
  return (
    <div className="form-check">
      <input type="radio" name={name} className="form-check-input" id={id} />
      <label
        className="form-check-label"
        style={{
          color: "#11395C",
          fontSize: "12px",
          fontFamily: "Poppins",
          //   fontWeight: "lighter",
        }}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default RadioInput;
