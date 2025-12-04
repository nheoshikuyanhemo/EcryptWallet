// Network configuration for Interchained
export const INTERCHAINED_NETWORK = {
  mainnet: {
    messagePrefix: '\x18Interchained Signed Message:\n',
    bech32: 'itc',
    bip32: {
      public: 0x0488B21E,
      private: 0x0488ADE4
    },
    pubKeyHash: 0x3a,
    scriptHash: 0x32,
    wif: 0x80,
    rpcPort: 8332,
    p2pPort: 8333,
    coin: 'ITC',
    explorer: 'https://explorer.interchained.org'
  },
  
  testnet: {
    messagePrefix: '\x18Interchained Testnet Signed Message:\n',
    bech32: 'titc',
    bip32: {
      public: 0x043587CF,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
    rpcPort: 18332,
    p2pPort: 18333,
    coin: 'tITC',
    explorer: 'https://testnet.interchained.org'
  }
};

// RPC endpoints
export const RPC_ENDPOINTS = {
  mainnet: [
    'http://node1.interchained.org:8332',
    'http://node2.interchained.org:8332'
  ],
  testnet: [
    'http://testnet.interchained.org:18332'
  ]
};

// App Constants
export const APP_INFO = {
  name: 'Ecrypt',
  version: '1.0.0',
  developer: '0xEixa',
  twitter: 'https://x.com/eixaid',
  website: 'https://github.com/0xEixa',
  logo: 'https://raw.githubusercontent.com/nheoshikuyanhemo/template/refs/heads/main/profil.png'
};

// Storage keys
export const STORAGE_KEYS = {
  WALLETS: '@ecrypt_wallets',
  ACTIVE_WALLET: '@ecrypt_active_wallet',
  SETTINGS: '@ecrypt_settings',
  CONTACTS: '@ecrypt_contacts',
  TOKENS: '@ecrypt_tokens'
};

// Transaction fees
export const FEES = {
  LOW: 0.00001,
  MEDIUM: 0.00005,
  HIGH: 0.0001,
  TOKEN_CREATE: 0.1
};
