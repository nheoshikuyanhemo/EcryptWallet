import { Buffer } from 'buffer';

// Format currency
export const formatCurrency = (amount, decimals = 6) => {
  return parseFloat(amount).toFixed(decimals);
};

// Format address
export const formatAddress = (address, start = 6, end = 4) => {
  if (!address || address.length < start + end) return address;
  return `${address.substring(0, start)}...${address.substring(address.length - end)}`;
};

// Format token ID
export const formatTokenId = (tokenId) => {
  if (!tokenId || tokenId.length < 10) return tokenId;
  return `${tokenId.substring(0, 6)}...${tokenId.substring(tokenId.length - 4)}`;
};

// Calculate fiat value
export const calculateFiatValue = (cryptoAmount, price) => {
  return (parseFloat(cryptoAmount) * parseFloat(price)).toFixed(2);
};

// Generate QR code data
export const generateQRData = (address, amount = null, tokenId = null) => {
  let data = `interchained:${address}`;
  if (amount) {
    data += `?amount=${amount}`;
  }
  if (tokenId) {
    data += `${amount ? '&' : '?'}token=${tokenId}`;
  }
  return data;
};

// Validate address
export const validateAddress = (address) => {
  // Basic validation - adjust for Interchained address format
  if (!address) return false;
  if (address.length < 26 || address.length > 35) return false;
  return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);
};

// Validate amount
export const validateAmount = (amount, balance) => {
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return false;
  if (num > parseFloat(balance)) return false;
  return true;
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random hex
export const generateRandomHex = (size) => {
  return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

// Sleep function
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Deep clone
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
