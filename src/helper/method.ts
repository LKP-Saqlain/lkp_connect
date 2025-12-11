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

export const extractBarModelData = (
  model: any,
  type: "Direct" | "Indirect" | "Total"
) => {
  if (!model) return { categories: [], series: [] };

  const months = [
    { key: "a", label: "Oct" },
    { key: "b", label: "Nov" },
    { key: "c", label: "Dec" },
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
