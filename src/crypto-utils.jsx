import CryptoJS from 'crypto-js';

export function encryptData(data, secretKey) {
    const encrypted = CryptoJS.RC4.encrypt(JSON.stringify(data), secretKey).toString();
    
    return encrypted;
}

export function decryptData(encryptedData, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}