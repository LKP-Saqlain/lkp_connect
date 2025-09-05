import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_LOCAL_STORAGE_SECRET_KEY;

export const setEncryptedValue = (
  key: string,
  value: string,
  useHashing = true
) => {
  try {
    const encrypted = CryptoJS.TripleDES.encrypt(
      CryptoJS.enc.Utf8.parse(value),
      useHashing
        ? CryptoJS.MD5(CryptoJS.enc.Utf8.parse(SECRET_KEY))
        : CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();

    localStorage.setItem(key, encrypted);
  } catch (err) {
    console.error("Token encryption error:", err);
  }
};

export const getDecryptedValue = (
  key: string,
  useHashing = true
): string | null => {
  try {
    const cipherText = localStorage.getItem(key);
    if (!cipherText) return null;

    const decrypted = CryptoJS.TripleDES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(cipherText),
      } as CryptoJS.lib.CipherParams,
      useHashing
        ? CryptoJS.MD5(CryptoJS.enc.Utf8.parse(SECRET_KEY))
        : CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8) || null;
  } catch (err) {
    console.error("Token decryption error:", err);
    return null;
  }
};
