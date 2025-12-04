import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { STORAGE_KEYS } from '../utils/constants';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);
  const [activeWallet, setActiveWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [network, setNetwork] = useState('testnet');

  // Load wallets from storage
  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setIsLoading(true);
      const storedWallets = await AsyncStorage.getItem(STORAGE_KEYS.WALLETS);
      const activeWalletId = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_WALLET);
      
      if (storedWallets) {
        const parsedWallets = JSON.parse(storedWallets);
        setWallets(parsedWallets);
        
        if (activeWalletId && parsedWallets.length > 0) {
          const active = parsedWallets.find(w => w.id === activeWalletId);
          if (active) {
            setActiveWallet(active);
            // Load wallet data
            await loadWalletData(active);
          }
        }
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWalletData = async (wallet) => {
    // Load balance, tokens, transactions
    // This would connect to RPC or API
    setBalance(12.345678);
    setTokens([
      {
        id: '0xabc123...tok',
        name: 'Ecrypt Token',
        symbol: 'ECR',
        balance: 1000,
        decimals: 8
      },
      {
        id: '0xdef456...tok',
        name: 'Test Token',
        symbol: 'TEST',
        balance: 500,
        decimals: 6
      }
    ]);
    setTransactions([
      {
        id: 'tx1',
        type: 'received',
        amount: 5.0,
        address: 'ITC123...abc',
        timestamp: Date.now() - 3600000,
        confirmed: true
      },
      {
        id: 'tx2',
        type: 'sent',
        amount: 2.5,
        address: 'ITC456...def',
        timestamp: Date.now() - 7200000,
        confirmed: true
      }
    ]);
  };

  const createWallet = async (walletData) => {
    try {
      const newWallet = {
        id: Date.now().toString(),
        ...walletData,
        createdAt: new Date().toISOString(),
        balance: 0
      };

      const updatedWallets = [...wallets, newWallet];
      setWallets(updatedWallets);
      setActiveWallet(newWallet);
      
      await AsyncStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updatedWallets));
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WALLET, newWallet.id);
      
      // Store private key in secure storage
      await Keychain.setInternetCredentials(
        `wallet_${newWallet.id}`,
        newWallet.address,
        walletData.encryptedPrivateKey,
        {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
        }
      );

      return { success: true, wallet: newWallet };
    } catch (error) {
      console.error('Error creating wallet:', error);
      return { success: false, error: error.message };
    }
  };

  const importWallet = async (mnemonic, password, walletName) => {
    // Implement wallet import logic
    return { success: true };
  };

  const switchWallet = async (walletId) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (wallet) {
      setActiveWallet(wallet);
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_WALLET, walletId);
      await loadWalletData(wallet);
    }
  };

  const updateBalance = async (newBalance) => {
    setBalance(newBalance);
    if (activeWallet) {
      const updatedWallets = wallets.map(w => 
        w.id === activeWallet.id ? { ...w, balance: newBalance } : w
      );
      setWallets(updatedWallets);
      await AsyncStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(updatedWallets));
    }
  };

  const sendTransaction = async (toAddress, amount, fee = 'MEDIUM') => {
    // Implement transaction sending
    console.log(`Sending ${amount} ITC to ${toAddress}`);
    return { success: true, txid: '0x' + Date.now().toString(16) };
  };

  const sendToken = async (tokenId, toAddress, amount) => {
    // Implement token sending
    console.log(`Sending ${amount} of token ${tokenId} to ${toAddress}`);
    return { success: true, txid: '0x' + Date.now().toString(16) };
  };

  const refreshData = async () => {
    if (activeWallet) {
      await loadWalletData(activeWallet);
    }
  };

  const value = {
    wallets,
    activeWallet,
    balance,
    tokens,
    transactions,
    isLoading,
    network,
    setNetwork,
    createWallet,
    importWallet,
    switchWallet,
    updateBalance,
    sendTransaction,
    sendToken,
    refreshData,
    loadWallets
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
