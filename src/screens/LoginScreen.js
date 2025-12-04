import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button';
import Input from '../components/Input';
import { useWallet } from '../store/walletStore';
import { APP_INFO } from '../utils/constants';

const LoginScreen = ({ navigation }) => {
  const [showOptions, setShowOptions] = useState(false);
  const { wallets } = useWallet();

  const handleCreateWallet = () => {
    navigation.navigate('CreateWallet');
  };

  const handleImportWallet = () => {
    // Navigate to import screen
    navigation.navigate('CreateWallet', { import: true });
  };

  const handleSelectWallet = (wallet) => {
    // Implement wallet selection with password
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <Image
            source={{ uri: APP_INFO.logo }}
            style={styles.logo}
          />
          <Text style={styles.title}>ECRYPT</Text>
          <Text style={styles.subtitle}>by 0xEixa</Text>
          <Text style={styles.tagline}>Secure Interchained Wallet</Text>
        </View>

        {/* Neon Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <View style={styles.neonGlow} />
        </View>

        {/* Main Options */}
        <View style={styles.optionsContainer}>
          {wallets.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Select Wallet</Text>
              {wallets.map((wallet, index) => (
                <TouchableOpacity
                  key={wallet.id}
                  style={styles.walletItem}
                  onPress={() => handleSelectWallet(wallet)}
                >
                  <View style={styles.walletIcon}>
                    <Icon name="account-balance-wallet" size={24} color="#ff0033" />
                  </View>
                  <View style={styles.walletInfo}>
                    <Text style={styles.walletName}>{wallet.name}</Text>
                    <Text style={styles.walletAddress}>
                      {wallet.address.substring(0, 12)}...{wallet.address.substring(wallet.address.length - 8)}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#666666" />
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <Text style={styles.welcomeText}>
              Welcome to Ecrypt Wallet
            </Text>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <Button
              title="Create New Wallet"
              onPress={handleCreateWallet}
              variant="primary"
              size="large"
              style={styles.mainButton}
            />
            
            <Button
              title="Import Existing Wallet"
              onPress={handleImportWallet}
              variant="secondary"
              size="large"
              style={styles.secondaryButton}
            />
          </View>
        </View>

        {/* Advanced Options */}
        <TouchableOpacity
          style={styles.advancedButton}
          onPress={() => setShowOptions(!showOptions)}
        >
          <Text style={styles.advancedButtonText}>
            Advanced Options
          </Text>
          <Icon 
            name={showOptions ? 'expand-less' : 'expand-more'} 
            size={24} 
            color="#ff0033" 
          />
        </TouchableOpacity>

        {showOptions && (
          <View style={styles.advancedOptions}>
            <TouchableOpacity style={styles.optionItem}>
              <Icon name="settings" size={20} color="#ffffff" />
              <Text style={styles.optionText}>Network Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <Icon name="security" size={20} color="#ffffff" />
              <Text style={styles.optionText}>Security Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.optionItem}>
              <Icon name="help" size={20} color="#ffffff" />
              <Text style={styles.optionText}>Help & Support</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Version {APP_INFO.version}
          </Text>
          <TouchableOpacity onPress={() => {/* Open twitter */}}>
            <Text style={styles.footerLink}>
              Follow @eixaid on X
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>
            Secure your digital assets with military-grade encryption
          </Text>
        </View>
      </ScrollView>

      {/* Neon Border Effects */}
      <View style={styles.neonBorderTop} />
      <View style={styles.neonBorderBottom} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ff0033',
    marginBottom: 20,
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#ff0033',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#ff0033',
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#aaaaaa',
    marginTop: 8,
  },
  dividerContainer: {
    position: 'relative',
    marginVertical: 30,
  },
  divider: {
    height: 2,
    backgroundColor: '#ff0033',
    width: '100%',
  },
  neonGlow: {
    position: 'absolute',
    top: -10,
    height: 22,
    width: '100%',
    backgroundColor: '#ff0033',
    opacity: 0.3,
    blurRadius: 20,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 16,
  },
  walletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#222222',
  },
  walletIcon: {
    marginRight: 12,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  walletAddress: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  welcomeText: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 30,
    fontWeight: '300',
    lineHeight: 32,
  },
  buttonGroup: {
    marginTop: 20,
  },
  mainButton: {
    marginBottom: 16,
  },
  secondaryButton: {
    marginBottom: 16,
  },
  advancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    marginBottom: 20,
  },
  advancedButtonText: {
    color: '#ff0033',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  advancedOptions: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  footerText: {
    color: '#666666',
    fontSize: 12,
    marginBottom: 8,
  },
  footerLink: {
    color: '#ff0033',
    fontSize: 14,
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
  footerNote: {
    color: '#444444',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  neonBorderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  neonBorderBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default LoginScreen;
