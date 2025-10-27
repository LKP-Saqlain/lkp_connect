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

  const categories = months.map((m) => m.label);

  const targetData = months.map((m) =>
    type === "Total"
      ? model[`${m.key}_Target_Total`] || 0
      : model[`${m.key}_Target_${type}`] || 0
  );

  const achievedData = months.map((m) =>
    type === "Total"
      ? model[`${m.key}_Total_Achieved`] || 0
      : model[`${m.key}_Achieved_${type}`] || 0
  );

  const series = [
    { name: "Target", data: targetData },
    { name: "Achieved", data: achievedData },
  ];

  return { categories, series };
};
