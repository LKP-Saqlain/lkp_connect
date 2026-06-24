export const regEx = {
  number: /^[0-9]*$/,
  phoneNumber: /@"^[0-9]{10}$"/,
  panRegex: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
  alphaNumeric: /^[a-zA-Z0-9]*$/,
  email:
    /^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+){0,1}\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i,
  pan: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
  alphabates: /^[a-zA-Z]*$/,
  line: /^(?!\s)([a-zA-Z. ])*$/,
  mobileNumber: /^[6789]([0-9])*$/,
  query: /^(?!\s)([a-zA-Z 0-9])*$/,
  arn: /^(?!\s)([a-zA-Z 0-9 -])*$/,
  raiseQuery: /^[ A-Za-z0-9@.,()/-]*$/,
  // arn: /^([a-zA-Z]){3}(-){1}([0-9]){5}?$/,
};

export function isValidPANNo(panNo: any) {
  const panRegex = RegExp(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/);
  return panRegex.test(panNo);
}

export const monthOptions = [
  { label: "All", value: "ALL" },
  { label: "Jan-26", value: "JAN-26" },
  { label: "Feb-26", value: "FEB-26" },
  { label: "Mar-26", value: "MAR-26" },
  { label: "Apr-26", value: "APR-26" },
  { label: "May-26", value: "MAY-26" },
  { label: "Jun-26", value: "JUN -26" },
];
export const symbolOptions = [
  { label: "All", value: "ALL" },
  { label: "Sensex", value: "SENSEX" },
  { label: "Nifty 50", value: "NIFTY" },
];

export const extractBarModelData = (
  model: any,
  type: "Direct" | "Indirect" | "Total",
) => {
  if (!model) return { categories: [], series: [] };

  const months = [
    { key: "a", label: "Jan" },
    { key: "b", label: "Feb" },
    { key: "c", label: "Mar" },
  ];

  // Convert model keys
  const transformedModel: any = {};
  Object.keys(model).forEach((key) => {
    const newKey = keyMapping[key] || key;
    transformedModel[newKey] = model[key];
  });

  const categories = months.map((m) => m.label);

  const targetData = months.map((m) => {
    const flag =
      type === "Total"
        ? `${m.key}_t_tot`
        : type === "Direct"
          ? `${m.key}_t_dir`
          : `${m.key}_t_idir`;

    return transformedModel[flag] || 0;
  });

  const achievedData = months.map((m) => {
    const flag =
      type === "Total"
        ? `${m.key}_a_tot`
        : type === "Direct"
          ? `${m.key}_a_dir`
          : `${m.key}_a_idir`;

    return transformedModel[flag] || 0;
  });

  const series = [
    { name: "Target", data: targetData },
    { name: "Achieved", data: achievedData },
  ];

  return { categories, series };
};

export const keyMapping: Record<string, string> = {
  //direct
  a_Target_Direct: "a_t_dir",
  a_Achieved_Direct: "a_a_dir",
  b_Target_Direct: "b_t_dir",
  b_Achieved_Direct: "b_a_dir",
  c_Target_Direct: "c_t_dir",
  c_Achieved_Direct: "c_a_dir",

  // Indirect
  a_Target_Indirect: "a_t_idir",
  a_Achieved_Indirect: "a_a_idir",
  b_Target_Indirect: "b_t_idir",
  b_Achieved_Indirect: "b_a_idir",
  c_Target_Indirect: "c_t_idir",
  c_Achieved_Indirect: "c_a_idir",

  // Total
  a_Target_Total: "a_t_tot",
  a_Total_Achieved: "a_a_tot",
  b_Target_Total: "b_t_tot",
  b_Total_Achieved: "b_a_tot",
  c_Target_Total: "c_t_tot",
  c_Total_Achieved: "c_a_tot",
};

export const convertToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const validatePartnerSharingRows = (rows: any[]): any => {
  const numberRegex = /^-?\d+$/;

  const isValidNumber = (value: any) => {
    if (value === null || value === undefined || value === "") return false;

    const str = String(value).trim();
    if (!numberRegex.test(str)) return false;

    const num = Number(str);

    if (num % 5 !== 0) return false;
    if (Math.abs(num) > 99) return false;

    return true;
  };

  for (const row of rows) {
    const apRaw = row.apshare ?? row.ApShare;
    const lkpRaw = row.lkpShare ?? row.LkpShare;

    if (!isValidNumber(apRaw) || !isValidNumber(lkpRaw)) {
      return {
        valid: false,
        message:
          "Only whole numbers (multiple of 5, max 2 digits) allowed. No decimals or symbols.",
      };
    }

    const ap = Number(apRaw);
    const lkp = Number(lkpRaw);

    if (ap + lkp !== 100) {
      return {
        valid: false,
        message: "AP Share + LKP Share must equal 100%",
      };
    }
  }

  return {
    valid: true,
    message: "",
  };
};
