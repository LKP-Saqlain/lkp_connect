import { TextField, Box, Typography, Paper } from "@mui/material";

const Nominee = ({ index, data, onChange }: any) => {
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
    address2: data[`noM${index}_ADD2`],
    address3: data[`noM${index}_ADD3`],
    city: data[`noM${index}_CITY`],
    pin: data[`noM${index}_PIN`],
    country: data[`noM${index}_CON`],
  };

  const title = `Nominee ${index}`;

  return (
    <Box sx={{}}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 2,
          background: "#fafafa",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, fontSize: "16px", fontWeight: 600 }}
        >
          {title + (index == 1 ? " *" : "")}
        </Typography>

        {Object.entries(nominee).map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^\w/, (c) => c.toUpperCase());

          return (
            <Box key={key} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label={label}
                value={value || ""}
                size="small"
                sx={{ backgroundColor: "white" }}
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
