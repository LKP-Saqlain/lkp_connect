import React from "react";

interface RadioInputProps {
  id: string;
  name: string;
  label: string;
  onChange?: (data: any) => void;
  value: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
  id,
  name,
  label,
  onChange,
  value,
}) => {
  return (
    <div className="form-check">
      <input
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        className="form-check-input"
        id={id}
        style={{ border: "1px solid rgb(0, 0, 0)" }}
      />
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
