import CryptoJS from "crypto-js";
const SECRET_KEY = import.meta.env.VITE_MANDATE_SECRET_KEY as string;
/**
 * AES Key & IV setup
 */

if (!SECRET_KEY) {
  console.error(
    "Missing VITE_MANDATE_SECRET_KEY — check .env or build config!"
  );
}
const getKeyAndIv = () => {
  const safeKey = SECRET_KEY.padEnd(16).substring(0, 16);
  const key = CryptoJS.enc.Utf8.parse(safeKey);
  return { key, iv: key };
};
/**
 * Encrypt text using AES-128-CBC with PKCS7 padding
 */
export const encryptAES = (plainText: string): string => {
  const { key, iv } = getKeyAndIv();
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64); // Base64 output
};
/**
 * Decrypt AES-128-CBC encrypted Base64 string
 */
export const decryptAES = (encryptedText: string): string => {
  const { key, iv } = getKeyAndIv();
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(encryptedText) } as any,
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};
