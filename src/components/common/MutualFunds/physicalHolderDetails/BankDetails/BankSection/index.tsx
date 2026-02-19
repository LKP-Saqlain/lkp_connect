import {
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import {
  accountTypeOptions,
  bankOptions,
} from "../../../../../../pages/MutualFund/mfTypes";

interface Props {
  title: string;
  values: any;
  errors: any;
  touched: any;
  disabled: boolean;
  onChange: (e: any) => void;
  onVerify: () => void;
}

const BankSection = ({
  title,
  values,
  errors,
  touched,
  disabled,
  onChange,
  onVerify,
}: Props) => {
  return (
    <>
      <h4 style={{ marginBottom: 25, fontWeight: 600 }}>{title}</h4>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={2.4}>
          <TextField
            name="bankAccNo"
            label="Bank A/C Number"
            value={values.bankAccNo}
            onChange={onChange}
            error={touched.bankAccNo && !!errors.bankAccNo}
            helperText={touched.bankAccNo && errors.bankAccNo}
            disabled={disabled}
            fullWidth
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={2.4}>
          <TextField
            name="reBankAccNo"
            label="Re-enter Bank A/C Number"
            value={values.reBankAccNo}
            onChange={(e) => {
              onChange(e);
              if (e.target.value !== values.bankAccNo) {
                errors.reBankAccNo = "Bank A/C Numbers do not match";
              } else {
                errors.reBankAccNo = "";
              }
            }}
            error={touched.reBankAccNo && !!errors.reBankAccNo}
            helperText={touched.reBankAccNo && errors.reBankAccNo}
            disabled={disabled}
            fullWidth
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={2.4}>
          <FormControl
            fullWidth
            size="small"
            error={touched.accountType && Boolean(errors.accountType)}
            disabled={disabled}
          >
            <InputLabel>Account Type</InputLabel>

            <Select
              name="accountType"
              label="Account Type"
              value={values.accountType}
              onChange={onChange}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>

              {accountTypeOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={2.4}>
          <TextField
            name="ifscCode"
            label="IFSC Code"
            value={values.ifscCode}
            onChange={onChange}
            error={touched.ifscCode && !!errors.ifscCode}
            helperText={touched.ifscCode && errors.ifscCode}
            disabled={disabled}
            fullWidth
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={2.4}>
          <Button
            variant="contained"
            fullWidth
            onClick={onVerify}
            disabled={disabled}
            sx={{ bgcolor: "#2c7a7b" }}
          >
            {disabled ? "Verified" : "Verify"}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl
            fullWidth
            size="small"
            error={touched.bankName && Boolean(errors.bankName)}
            disabled={disabled}
          >
            <InputLabel>Bank Name</InputLabel>

            <Select
              name="bankName"
              label="Bank Name"
              value={values.bankName}
              onChange={onChange}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>

              {bankOptions.map((bank) => (
                <MenuItem key={bank.value} value={bank.label}>
                  {bank.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            name="micrCode"
            label="MICR Code (Optional)"
            value={values.micrCode}
            onChange={onChange}
            disabled={disabled}
            fullWidth
            size="small"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default BankSection;
