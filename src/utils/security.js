import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';

// Encrypt data
export const encryptData = (data, password) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Decrypt data
export const decryptData = (encryptedData, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Hash password
export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

// Generate mnemonic (simplified)
export const generateMnemonic = () => {
  const wordlist = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent',
    'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident',
    // ... add more words as needed
  ];
  
  const words = [];
  for (let i = 0; i < 12; i++) {
    words.push(wordlist[Math.floor(Math.random() * wordlist.length)]);
  }
  return words.join(' ');
};

// Generate seed from mnemonic
export const mnemonicToSeed = (mnemonic) => {
  const mnemonicStr = mnemonic.normalize('NFKD');
  const salt = 'mnemonic';
  
  const key = CryptoJS.PBKDF2(mnemonicStr, salt, {
    keySize: 512 / 32,
    iterations: 2048,
    hasher: CryptoJS.algo.SHA512
  });
  
  return Buffer.from(key.toString(CryptoJS.enc.Hex), 'hex');
};

// Generate key pair from seed
export const generateKeyPair = (seed, network) => {
  const bitcoin = require('bitcoinjs-lib');
  const root = bitcoin.bip32.fromSeed(seed, network);
  const account = root.derivePath("m/44'/0'/0'/0/0");
  return account;
};

// Sanitize input
export const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '');
};

// Validate password strength
export const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain number';
  if (!/[!@#$%^&*]/.test(password)) return 'Password must contain special character';
  return null;
};
