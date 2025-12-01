import { useEffect, useState } from "react";
import { TextField, Box, Typography, Paper, Button } from "@mui/material";
import { SelectPicker, DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import {
  idTypes,
  minorOptions,
  relationshipOptions,
} from "../../../../helper/commmon";

type NomineeType = {
  name: string;
  relationship: string;
  applicable: string; // keep as string to preserve user input
  dob: string;
  minor: string; // "Y"/"N"
  guardian: string;
  idType: string;
  idNo: string;
  email: string;
  mobile: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  pin: string;
  country: string;
};

// mapping from internal short keys -> parent data keys
const parentFieldMap = (index: number): any => ({
  name: `nominee${index}Name`,
  relationship: `nominee${index}Relationship`,
  applicable: `nominee${index}Applicable`,
  dob: `nominee${index}DOB`,
  minor: `nominee${index}MinorFlag`,
  guardian: `nominee${index}Guardian`,
  idType: `noM${index}_ID_TYP`,
  idNo: `noM${index}_IDNO`,
  email: `noM${index}_EMAIL`,
  mobile: `noM${index}_MOB`,
  address1: `noM${index}_ADD1`,
  address2: `noM${index}_ADD2`,
  address3: `noM${index}_ADD3`,
  city: `noM${index}_CITY`,
  pin: `noM${index}_PIN`,
  country: `noM${index}_CON`,
});

const parseDateStringToDate = (s?: string | null) => {
  if (!s) return null;
  // accept yyyy-mm-dd or ISO strings or dd/mm/yyyy (try convert)
  const isoMatch = /^\d{4}-\d{2}-\d{2}/.test(s);
  if (isoMatch) return new Date(s);
  const isoFull = Date.parse(s);
  if (!isNaN(isoFull)) return new Date(isoFull);
  // try dd/mm/yyyy
  const dm = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dm) {
    const [, dd, mm, yyyy] = dm;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  }
  return null;
};

const formatDateToISO = (d: Date | null) => {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

type Props = {
  index: number;
  data: any; // parent data object
  onChange: (payload: { index: number; field: string; value: any }) => void;
  onSaveStatus: (index: number, valid: boolean) => void;
};

export default function Nominee({
  index,
  data,
  onChange,
  onSaveStatus,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof NomineeType, string>>
  >({});

  const map = parentFieldMap(index);

  // build local nominee state view from parent data
  const nominee: NomineeType = {
    name: data[map.name] || "",
    relationship: data[map.relationship] || "",
    applicable: data[map.applicable] || "",
    dob: data[map.dob] || "",
    minor: data[map.minor] || "",
    guardian: data[map.guardian] || "",
    idType: data[map.idType] || "",
    idNo: data[map.idNo] || "",
    email: data[map.email] || "",
    mobile: data[map.mobile] || "",
    address1: data[map.address1] || "",
    address2: data[map.address2] || "",
    address3: data[map.address3] || "",
    city: data[map.city] || "",
    pin: data[map.pin] || "",
    country: data[map.country] || "",
  };

  const isNominee1 = index === 1;

  // validation rules
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NomineeType, string>> = {};

    // whether to validate (nominee1 always, others only if any field filled)
    const anyFieldFilled = Object.values(nominee).some(
      (v) => v !== undefined && v !== null && v.toString().trim() !== ""
    );
    const shouldValidate = isNominee1 || anyFieldFilled;
    if (!shouldValidate) {
      setErrors({});
      onSaveStatus(index, true);
      return true;
    }

    const setErr = (k: keyof NomineeType, msg: string) => {
      newErrors[k] = msg;
    };

    // required checks
    if (!nominee.name.toString().trim()) setErr("name", "Required");
    if (!nominee.relationship.toString().trim())
      setErr("relationship", "Required");

    // applicable: integer, 0-100, no decimal
    if (nominee.applicable.toString().trim() === "") {
      setErr("applicable", "Required");
    } else {
      const num = Number(nominee.applicable);
      if (!Number.isInteger(num) || num < 0 || num > 100) {
        setErr("applicable", "Integer 0-100 only");
      }
    }

    // minor required
    if (!nominee.minor || nominee.minor.toString().trim() === "")
      setErr("minor", "Required");

    // determine minor flag
    const minorVal = nominee.minor?.toString().toLowerCase();
    const isMinor =
      minorVal === "y" || minorVal === "yes" || minorVal === "minor";

    // guardian + dob required only if minor is Yes
    if (isMinor) {
      if (!nominee.guardian.toString().trim())
        setErr("guardian", "Required for minor");

      if (!nominee.dob || nominee.dob.toString().trim() === "")
        setErr("dob", "Required for minor");
    }

    // idType required
    if (!nominee.idType.toString().trim()) setErr("idType", "Required");
    if (!nominee.idNo.toString().trim()) setErr("idNo", "Required");

    // email format
    if (!nominee.email.toString().trim()) {
      setErr("email", "Required");
    } else {
      const ok = /^\S+@\S+\.\S+$/.test(nominee.email.toString());
      if (!ok) setErr("email", "Invalid email");
    }

    // mobile 10 digits
    if (!nominee.mobile.toString().trim()) {
      setErr("mobile", "Required");
    } else {
      const digits = nominee.mobile.toString().replace(/\D/g, "");
      if (!/^\d{10}$/.test(digits)) setErr("mobile", "10 digits required");
    }

    // address1, city, pin, country required
    if (!nominee.address1.toString().trim()) setErr("address1", "Required");
    if (!nominee.city.toString().trim()) setErr("city", "Required");
    if (!nominee.pin.toString().trim()) setErr("pin", "Required");
    else {
      const pinDigits = nominee.pin.toString().replace(/\D/g, "");
      if (!/^\d{6}$/.test(pinDigits)) setErr("pin", "6 digits required");
    }
    if (!nominee.country.toString().trim()) setErr("country", "Required");

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onSaveStatus(index, isValid);
    return isValid;
  };

  // wire up save
  const handleSave = () => {
    if (!validate()) return;
    setIsEditing(false);
    onSaveStatus(index, true);
  };

  // when parent data changes (e.g. initial load), auto-validate nominee1
  useEffect(() => {
    if (isNominee1) validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const editable = isNominee1 || isEditing;

  // helper to call parent with parent-key mapping
  const emitChange = (shortKey: any, value: any) => {
    const parentKey = parentFieldMap(index)[shortKey];
    onChange({ index, field: parentKey, value });
  };

  // date value conversion for RSuite DatePicker
  const dateValue = parseDateStringToDate(nominee.dob);

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {`Nominee ${index}`} {isNominee1 && "*"}
          </Typography>

          {isNominee1 ? null : !isEditing ? (
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSave}>
              Save
            </Button>
          )}
        </Box>

        {/* Name */}
        <TextField
          label="Name"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.name || ""}
          error={!!errors.name}
          helperText={errors.name}
          onChange={(e) => emitChange("name", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Relationship (RSuite SelectPicker) */}
        <Box sx={{ mb: 2 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Relationship
          </label>
          <SelectPicker
            data={relationshipOptions}
            value={nominee.relationship || null}
            disabled={!editable}
            onChange={(v) => emitChange("relationship", v || "")}
            style={{ width: "100%" }}
            placeholder=""
            cleanable={false}
          />
          {errors.relationship && (
            <Typography color="error" variant="caption">
              {errors.relationship}
            </Typography>
          )}
        </Box>

        {/* Applicable (%) */}
        <TextField
          label="Applicable (%)"
          type="number"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.applicable || ""}
          error={!!errors.applicable}
          helperText={errors.applicable}
          inputProps={{ min: 0, max: 100 }}
          onChange={(e) => {
            // allow only integers in UI
            const val = e.target.value;
            const intVal = val.includes(".") ? val.split(".")[0] : val;
            emitChange("applicable", intVal);
          }}
          sx={{ mb: 2 }}
        />

        {/* DOB (RSuite DatePicker) */}

        {/* Minor */}
        <Box sx={{ mb: 2 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Minor</label>
          <SelectPicker
            data={minorOptions}
            value={nominee.minor || null}
            disabled={!editable}
            onChange={(v) => emitChange("minor", v || "")}
            style={{ width: "100%" }}
            placeholder=""
            cleanable={false}
          />
          {errors.minor && (
            <Typography color="error" variant="caption">
              {errors.minor}
            </Typography>
          )}
        </Box>

        {/* Guardian - only when minor = Y */}
        {(nominee.minor === "Y" ||
          nominee.minor === "y" ||
          nominee.minor === "yes") && (
          <TextField
            label="Guardian"
            fullWidth
            size="small"
            disabled={!editable}
            value={nominee.guardian || ""}
            error={!!errors.guardian}
            helperText={errors.guardian}
            onChange={(e) => emitChange("guardian", e.target.value)}
            sx={{ mb: 2 }}
          />
        )}
        {(nominee.minor === "Y" ||
          nominee.minor === "y" ||
          nominee.minor === "yes") && (
          <Box sx={{ mb: 2 }}>
            <label style={{ display: "block", marginBottom: 6 }}>
              Date of Birth
            </label>
            <DatePicker
              value={dateValue}
              disabled={!editable}
              onChange={(d: Date | null) => {
                emitChange("dob", formatDateToISO(d));
              }}
              style={{ width: "100%" }}
              placeholder="DD/MM/YYYY"
              oneTap
            />
            {errors.dob && (
              <Typography color="error" variant="caption">
                {errors.dob}
              </Typography>
            )}
          </Box>
        )}
        {/* ID Type */}
        <Box sx={{ mb: 2 }}>
          <label style={{ display: "block", marginBottom: 6 }}>ID Type</label>
          <SelectPicker
            data={idTypes}
            value={nominee.idType || null}
            disabled={!editable}
            onChange={(v) => emitChange("idType", v || "")}
            style={{ width: "100%" }}
            placeholder=""
            cleanable={false}
          />
          {errors.idType && (
            <Typography color="error" variant="caption">
              {errors.idType}
            </Typography>
          )}
        </Box>

        {/* ID Number */}
        <TextField
          label="ID Number"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.idNo || ""}
          error={!!errors.idNo}
          helperText={errors.idNo}
          onChange={(e) => emitChange("idNo", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Email */}
        <TextField
          label="Email"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.email || ""}
          error={!!errors.email}
          helperText={errors.email}
          onChange={(e) => emitChange("email", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Mobile */}
        <TextField
          label="Mobile"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.mobile || ""}
          error={!!errors.mobile}
          helperText={errors.mobile}
          inputProps={{ maxLength: 10 }}
          onChange={(e) =>
            emitChange("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          sx={{ mb: 2 }}
        />

        {/* Address 1 */}
        <TextField
          label="Address 1"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.address1 || ""}
          error={!!errors.address1}
          helperText={errors.address1}
          inputProps={{ maxLength: 39 }}
          onChange={(e) => emitChange("address1", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Address 2 (optional) */}
        <TextField
          label="Address 2 (Optional)"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.address2 || ""}
          inputProps={{ maxLength: 39 }}
          onChange={(e) => emitChange("address2", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Address 3 (optional) */}
        <TextField
          label="Address 3 (Optional)"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.address3 || ""}
          inputProps={{ maxLength: 39 }}
          onChange={(e) => emitChange("address3", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* City */}
        <TextField
          label="City"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.city || ""}
          error={!!errors.city}
          helperText={errors.city}
          onChange={(e) => emitChange("city", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Pin */}
        <TextField
          label="Pin"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.pin || ""}
          error={!!errors.pin}
          helperText={errors.pin}
          onChange={(e) =>
            emitChange("pin", e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          sx={{ mb: 2 }}
        />

        {/* Country */}
        <TextField
          label="Country"
          fullWidth
          size="small"
          disabled={!editable}
          value={nominee.country || ""}
          error={!!errors.country}
          helperText={errors.country}
          onChange={(e) => emitChange("country", e.target.value)}
        />
      </Paper>
    </Box>
  );
}
