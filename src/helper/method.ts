export const regEx = {
    number: /^[0-9]*$/,
    phoneNumber: /@"^[0-9]{10}$"/,
    panRegex: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
    alphaNumeric: /^[a-zA-Z0-9]*$/,
    email: /^([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9,!\#\$%&'\*\+\/=\?\^_`\{\|\}~-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*@([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z0-9-]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+){0,1}\.(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]){2,})$/i,
    pan: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
    alphabates: /^[a-zA-Z]*$/,
    line: /^(?!\s)([a-zA-Z. ])*$/,
    mobileNumber: /^[6789]([0-9])*$/,
    query: /^(?!\s)([a-zA-Z 0-9])*$/,
    arn: /^(?!\s)([a-zA-Z 0-9 -])*$/,
    raiseQuery: /^[ A-Za-z0-9@.,()/-]*$/,
    // arn: /^([a-zA-Z]){3}(-){1}([0-9]){5}?$/,

}

export function isValidPANNo(panNo: any) {
    const panRegex = RegExp(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/);
    return panRegex.test(panNo);
}