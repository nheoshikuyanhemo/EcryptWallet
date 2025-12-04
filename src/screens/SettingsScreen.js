import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button';
import { useWallet } from '../store/walletStore';
import { APP_INFO } from '../utils/constants';

const SettingsScreen = ({ navigation }) => {
  const { activeWallet, network, setNetwork, wallets, switchWallet } = useWallet();
  
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleSwitchWallet = (walletId) => {
    switchWallet(walletId);
    navigation.navigate('Dashboard');
  };

  const handleBackupWallet = () => {
    Alert.alert(
      'Backup Wallet',
      'This will show your recovery phrase. Make sure you are in a private location.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', style: 'destructive' }
      ]
    );
  };

  const handleDeleteWallet = () => {
    Alert.alert(
      'Delete Wallet',
      'This action cannot be undone. Are you sure you want to delete this wallet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Delete wallet logic
            Alert.alert('Success', 'Wallet deleted successfully');
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const handleNetworkSwitch = (newNetwork) => {
    setNetwork(newNetwork);
    Alert.alert('Network Changed', `Switched to ${newNetwork.toUpperCase()} network`);
  };

  const openTwitter = () => {
    // Open twitter link
    Alert.alert('Twitter', `Opening ${APP_INFO.twitter}`);
  };

  const openWebsite = () => {
    // Open website
    Alert.alert('Website', `Opening ${APP_INFO.website}`);
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Icon name={icon} size={24} color="#ff0033" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#ff0033" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity onPress={() => setAdvancedMode(!advancedMode)}>
          <Icon name="build" size={30} color={advancedMode ? '#ff0033' : '#666666'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Current Wallet Info */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Icon name="account-balance-wallet" size={40} color="#ff0033" />
            <View style={styles.walletInfo}>
              <Text style={styles.walletName}>{activeWallet?.name || 'No Wallet'}</Text>
              <Text style={styles.walletAddress}>
                {activeWallet?.address ? 
                  `${activeWallet.address.substring(0, 12)}...${activeWallet.address.substring(activeWallet.address.length - 8)}` : 
                  'Not loaded'
                }
              </Text>
            </View>
          </View>
          
          <View style={styles.walletStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Network</Text>
              <Text style={styles.statValue}>{network.toUpperCase()}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Wallets</Text>
              <Text style={styles.statValue}>{wallets.length}</Text>
            </View>
          </View>
        </View>

        {/* Wallet Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallet Management</Text>
          
          <SettingItem
            icon="account-balance-wallet"
            title="Switch Wallet"
            subtitle="Change active wallet"
            onPress={() => {/* Open wallet switcher */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="backup"
            title="Backup Wallet"
            subtitle="Save your recovery phrase"
            onPress={handleBackupWallet}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="add-circle"
            title="Create New Wallet"
            onPress={() => navigation.navigate('CreateWallet')}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="file-download"
            title="Import Wallet"
            onPress={() => navigation.navigate('CreateWallet', { import: true })}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <SettingItem
            icon="fingerprint"
            title="Biometric Authentication"
            subtitle="Use fingerprint or face ID"
            rightComponent={
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ false: '#333333', true: '#ff0033' }}
                thumbColor={biometricsEnabled ? '#ffffff' : '#aaaaaa'}
              />
            }
          />
          
          <SettingItem
            icon="lock"
            title="Change Password"
            onPress={() => {/* Change password */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="security"
            title="Auto-lock"
            subtitle="Lock wallet after 5 minutes"
            onPress={() => {/* Auto-lock settings */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="visibility-off"
            title="Hide Balances"
            subtitle="Hide amounts on main screen"
            rightComponent={
              <Switch
                value={false}
                onValueChange={(value) => {}}
                trackColor={{ false: '#333333', true: '#ff0033' }}
                thumbColor="#aaaaaa"
              />
            }
          />
        </View>

        {/* Network */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network</Text>
          
          <SettingItem
            icon="public"
            title="Network"
            subtitle={`Currently on ${network}`}
            onPress={() => {}}
            rightComponent={
              <View style={styles.networkBadge}>
                <Text style={styles.networkText}>{network.toUpperCase()}</Text>
              </View>
            }
          />
          
          <View style={styles.networkOptions}>
            <TouchableOpacity 
              style={[styles.networkOption, network === 'mainnet' && styles.networkOptionActive]}
              onPress={() => handleNetworkSwitch('mainnet')}
            >
              <Text style={[styles.networkOptionText, network === 'mainnet' && styles.networkOptionTextActive]}>
                Mainnet
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.networkOption, network === 'testnet' && styles.networkOptionActive]}
              onPress={() => handleNetworkSwitch('testnet')}
            >
              <Text style={[styles.networkOptionText, network === 'testnet' && styles.networkOptionTextActive]}>
                Testnet
              </Text>
            </TouchableOpacity>
          </View>
          
          <SettingItem
            icon="dns"
            title="Custom RPC Node"
            subtitle="Configure custom node"
            onPress={() => {/* Custom RPC settings */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive transaction alerts"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#333333', true: '#ff0033' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#aaaaaa'}
              />
            }
          />
          
          <SettingItem
            icon="dark-mode"
            title="Dark Mode"
            subtitle="Use dark theme"
            rightComponent={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#333333', true: '#ff0033' }}
                thumbColor={darkModeEnabled ? '#ffffff' : '#aaaaaa'}
              />
            }
          />
          
          <SettingItem
            icon="language"
            title="Language"
            subtitle="English (US)"
            onPress={() => {/* Language selector */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="currency-exchange"
            title="Currency"
            subtitle="USD"
            onPress={() => {/* Currency selector */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
        </View>

        {/* Advanced Settings (Conditional) */}
        {advancedMode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced</Text>
            
            <SettingItem
              icon="developer-mode"
              title="Developer Mode"
              subtitle="Show debug options"
              rightComponent={
                <Switch
                  value={false}
                  onValueChange={(value) => {}}
                  trackColor={{ false: '#333333', true: '#ff0033' }}
                  thumbColor="#aaaaaa"
                />
              }
            />
            
            <SettingItem
              icon="api"
              title="RPC Console"
              subtitle="Advanced RPC commands"
              onPress={() => {/* RPC console */}}
              rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
            />
            
            <SettingItem
              icon="storage"
              title="Clear Cache"
              subtitle="Clear local data"
              onPress={() => {
                Alert.alert('Clear Cache', 'This will clear all cached data');
              }}
              rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
            />
            
            <SettingItem
              icon="sync"
              title="Rescan Blockchain"
              subtitle="Sync from block 0"
              onPress={() => {
                Alert.alert('Rescan', 'This may take several minutes');
              }}
              rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
            />
          </View>
        )}

        {/* About & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Support</Text>
          
          <SettingItem
            icon="info"
            title="About Ecrypt"
            subtitle={`Version ${APP_INFO.version}`}
            onPress={() => {/* About screen */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="help"
            title="Help & Support"
            onPress={() => {/* Help screen */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="privacy-tip"
            title="Privacy Policy"
            onPress={() => {/* Privacy policy */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="description"
            title="Terms of Service"
            onPress={() => {/* Terms of service */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
          
          <SettingItem
            icon="star"
            title="Rate App"
            onPress={() => {/* Rate app */}}
            rightComponent={<Icon name="chevron-right" size={24} color="#666666" />}
          />
        </View>

        {/* Developer Info */}
        <View style={styles.developerCard}>
          <Text style={styles.developerTitle}>ECRYPT Wallet</Text>
          <Text style={styles.developerSubtitle}>by 0xEixa</Text>
          
          <View style={styles.developerLinks}>
            <TouchableOpacity style={styles.devLink} onPress={openTwitter}>
              <Icon name="x" size={20} color="#ff0033" />
              <Text style={styles.devLinkText}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.devLink} onPress={openWebsite}>
              <Icon name="code" size={20} color="#ff0033" />
              <Text style={styles.devLinkText}>GitHub</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.devLink}>
              <Icon name="email" size={20} color="#ff0033" />
              <Text style={styles.devLinkText}>Contact</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.copyright}>
            © 2024 0xEixa. All rights reserved.
          </Text>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <Button
            title="Delete This Wallet"
            onPress={handleDeleteWallet}
            variant="danger"
            style={styles.dangerButton}
          />
          
          <Button
            title="Reset All Data"
            onPress={() => {
              Alert.alert('Reset All Data', 'This will delete ALL wallets and data');
            }}
            variant="outline"
            style={styles.dangerButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  walletCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ff0033',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletInfo: {
    marginLeft: 16,
  },
  walletName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 12,
    color: '#666666',
  },
  walletStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  section: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  networkBadge: {
    backgroundColor: '#ff003320',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  networkText: {
    color: '#ff0033',
    fontSize: 12,
    fontWeight: 'bold',
  },
  networkOptions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  networkOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  networkOptionActive: {
    backgroundColor: '#ff003320',
    borderWidth: 1,
    borderColor: '#ff0033',
  },
  networkOptionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  networkOptionTextActive: {
    color: '#ff0033',
  },
  developerCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  developerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  developerSubtitle: {
    fontSize: 16,
    color: '#ff0033',
    marginBottom: 16,
  },
  developerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  devLink: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  devLinkText: {
    color: '#ff0033',
    fontSize: 12,
    marginTop: 4,
  },
  copyright: {
    color: '#666666',
    fontSize: 10,
    textAlign: 'center',
  },
  dangerSection: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ff0033',
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0033',
    marginBottom: 16,
    textAlign: 'center',
  },
  dangerButton: {
    marginBottom: 12,
  },
});

export default SettingsScreen;
