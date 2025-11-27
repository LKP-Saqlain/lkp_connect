import { useState, useEffect } from "react";
import { TextField, Box, Typography, Paper, Button } from "@mui/material";

const Nominee = ({ index, data, onChange, onSaveStatus }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const isNominee1 = index === 1;

  // nominee fields
  const nominee = {
    name: data[`nominee${index}Name`],
    relationship: data[`nominee${index}Relationship`],
    applicable: data[`nominee${index}Applicable`],
    dob: data[`nominee${index}DOB`],
    minor: data[`nominee${index}MinorFlag`],
    guardian: data[`nominee${index}Guardian`],
    idType: data[`noM${index}_ID_TYP`],
    idNo: data[`noM${index}_IDNO`],
    email: data[`noM${index}_EMAIL`],
    mobile: data[`noM${index}_MOB`],
    address1: data[`noM${index}_ADD1`],
    address2: data[`noM${index}_ADD2`], // optional
    address3: data[`noM${index}_ADD3`], // optional
    city: data[`noM${index}_CITY`],
    pin: data[`noM${index}_PIN`],
    country: data[`noM${index}_CON`],
  };

  // ---------------------
  // VALIDATION FUNCTION
  // ---------------------
  const validate = () => {
    let newErrors: any = {};

    const anyFieldFilled = Object.values(nominee).some(
      (v) => v && v.toString().trim() !== ""
    );

    const shouldValidate = isNominee1 || anyFieldFilled;

    if (shouldValidate) {
      Object.entries(nominee).forEach(([key, value]) => {
        if (key === "address2" || key === "address3") return; // optional
        if (!value || value.toString().trim() === "") {
          newErrors[key] = true;
        }
      });
    }

    setErrors(newErrors);

    //  ALWAYS inform parent of valid/invalid state
    const isValid = Object.keys(newErrors).length === 0;
    onSaveStatus(index, isValid);

    return isValid;
  };

  // ---------------------
  // SAVE BUTTON HANDLER
  // ---------------------
  const handleSave = () => {
    if (!validate()) return; // block save

    setIsEditing(false);

    // ensures parent knows it's saved & valid
    onSaveStatus(index, true);
  };

  useEffect(() => {
    onSaveStatus(index, true);
  }, [isEditing]);

  // ---------------------
  // AUTO-VALIDATE NOMINEE 1
  // ---------------------
  useEffect(() => {
    if (isNominee1) {
      validate();
    }
  }, [data]);

  return (
    <Box>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 2,
          background: isEditing || isNominee1 ? "#fff" : "#f0f0f0",
          opacity: isEditing || isNominee1 ? 1 : 0.6,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: 600 }}>
            {`Nominee ${index}` + (isNominee1 ? " *" : "")}
          </Typography>

          {isNominee1 ? null : !isEditing ? (
            <Button
              variant="contained"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleSave}
            >
              Save
            </Button>
          )}
        </Box>

        {/* FIELDS */}
        {Object.entries(nominee).map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^\w/, (c) => c.toUpperCase());

          const editable = isNominee1 || isEditing;

          return (
            <Box key={key} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label={label}
                value={value || ""}
                disabled={!editable}
                required={editable && key !== "address2" && key !== "address3"}
                error={!!errors[key]}
                helperText={errors[key] ? "Required field" : ""}
                sx={{
                  backgroundColor: editable ? "white" : "#eaeaea",
                }}
                onChange={(e) =>
                  onChange({
                    index,
                    field: key,
                    value: e.target.value,
                  })
                }
              />
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
};

export default Nominee;
