import { Box, Grid, Typography, Button, TextField } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

/* ================= COMMON COMPONENTS ================= */

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography fontWeight={700} fontSize={18} mb={1}>
    {children}
  </Typography>
);

export const Label = ({ children }: { children: React.ReactNode }) => (
  <Typography fontSize={12} color="#6B7280" mb={0.5}>
    {children}
  </Typography>
);

export const DisplayBox = ({ value }: { value?: string }) => (
  <Box
    sx={{
      minHeight: 42,
      px: 1.5,
      py: 1,
      borderRadius: 2,
      border: "1px solid #D1D5DB",
      bgcolor: "#F9FAFB",
      display: "flex",
      alignItems: "center",
      fontSize: 14,
      fontWeight: 500,
      wordBreak: "break-word",
      whiteSpace: "pre-wrap",
    }}
  >
    {value?.trim() ? value : "-"}
  </Box>
);

export const FieldGrid = ({ fields }: any) => (
  <Grid container spacing={3}>
    {fields.map((item: any, i: number) => (
      <Grid
        key={i}
        item
        xs={12}
        sm={item.sm || 6}
        md={item.md || 4}
        lg={item.lg || 3}
      >
        <Label>{item.label}</Label>

        {item.editable ? (
          <EditableDisplayBox
            value={item.value}
            onChange={item.onChange}
            editable={item.editable}
          />
        ) : (
          <DisplayBox value={item.value} />
        )}
      </Grid>
    ))}
  </Grid>
);

export const EditableDisplayBox = ({
  value,
  onChange,
  editable,
}: {
  value?: string;
  onChange?: (value: string) => void;
  editable?: boolean;
}) => {
  console.log(value, "editable value", editable);

  if (editable) {
    return (
      <TextField
        fullWidth
        size="small"
        placeholder="Enter Employee Code"
        value={value || ""}
        onChange={(e) => {
          const onlyNums = e.target.value.replace(/\D/g, "");
          // allow max 4 digits
          if (onlyNums.length <= 4) {
            onChange?.(onlyNums);
          }
        }}
        inputProps={{
          maxLength: 4,
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "#fff",
            fontSize: 14,
            minHeight: 42,
          },
        }}
      />
    );
  }

  return <DisplayBox value={value} />;
};

export const SelectableBox = ({
  label,
  selected,
}: {
  label: string;
  selected: boolean;
}) => (
  <Box
    sx={{
      px: 3,
      py: 1.2,
      borderRadius: 2,
      border: "1px solid",
      borderColor: selected ? "#1F5A96" : "#D1D5DB",
      bgcolor: selected ? "#E8F1FB" : "#F9FAFB",
      minWidth: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Typography
      fontSize={14}
      fontWeight={500}
      color={selected ? "#1F5A96" : "#374151"}
    >
      {label}
    </Typography>

    {selected ? (
      <CheckBoxIcon sx={{ color: "#1F5A96", fontSize: 20, ml: 1 }} />
    ) : (
      <CheckBoxOutlineBlankIcon
        sx={{ color: "#9CA3AF", fontSize: 20, ml: 1 }}
      />
    )}
  </Box>
);

export const ActionButton = ({
  label,
  color,
  bg,
  onClick,
}: {
  label: string;
  color: string;
  bg: string;
  onClick?: () => void;
}) => (
  <Button
    variant="outlined"
    onClick={onClick}
    sx={{
      textTransform: "none",
      borderRadius: 2,
      px: 3,
      height: 40,
      borderColor: color,
      color,
      backgroundColor: bg,
    }}
  >
    {label}
  </Button>
);
