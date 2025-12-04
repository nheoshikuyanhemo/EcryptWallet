import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-svg';
import Button from '../components/Button';
import { useWallet } from '../store/walletStore';
import { formatAddress, copyToClipboard, generateQRData } from '../utils/helpers';
import { APP_INFO } from '../utils/constants';

const ReceiveScreen = ({ navigation }) => {
  const { activeWallet, balance } = useWallet();
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  
  const address = activeWallet?.address || '';
  const qrData = generateQRData(address, amount || null, selectedToken?.id || null);

  const handleShare = async () => {
    try {
      const shareText = amount 
        ? `Send me ${amount} ${selectedToken ? selectedToken.symbol : 'ITC'} to ${address}`
        : `My Interchained address: ${address}`;
      
      await Share.share({
        message: shareText,
        title: 'My Interchained Address',
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleCopy = async () => {
    const copied = await copyToClipboard(address);
    if (copied) {
      Alert.alert('Success', 'Address copied to clipboard');
    } else {
      Alert.alert('Error', 'Failed to copy address');
    }
  };

  const handleSetAmount = () => {
    Alert.prompt(
      'Set Amount',
      'Enter amount to receive',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: (value) => {
            if (value && !isNaN(parseFloat(value))) {
              setAmount(value);
            }
          }
        }
      ],
      'plain-text',
      amount
    );
  };

  const handleClearAmount = () => {
    setAmount('');
  };

  if (!activeWallet) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>No wallet loaded</Text>
          <Button
            title="Go to Dashboard"
            onPress={() => navigation.navigate('Dashboard')}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#ff0033" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receive</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={30} color="#ff0033" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrData}
              size={200}
              backgroundColor="#ffffff"
              color="#000000"
            />
            
            {/* App Logo Overlay */}
            <View style={styles.qrOverlay}>
              <Text style={styles.qrOverlayText}>ECRYPT</Text>
            </View>
          </View>
          
          {/* Amount Display */}
          {amount ? (
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Requesting:</Text>
              <View style={styles.amountRow}>
                <Text style={styles.amountValue}>
                  {amount} {selectedToken ? selectedToken.symbol : 'ITC'}
                </Text>
                <TouchableOpacity onPress={handleClearAmount}>
                  <Icon name="close" size={20} color="#ff0033" />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>

        {/* Address Display */}
        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Your Address</Text>
          <TouchableOpacity style={styles.addressContainer} onPress={handleCopy}>
            <Text style={styles.addressText} numberOfLines={1}>
              {formatAddress(address, 12, 8)}
            </Text>
            <Icon name="content-copy" size={20} color="#ff0033" />
          </TouchableOpacity>
          
          <Text style={styles.fullAddress} numberOfLines={2}>
            {address}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
            <View style={[styles.actionIcon, { backgroundColor: '#ff003320' }]}>
              <Icon name="content-copy" size={24} color="#ff0033" />
            </View>
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <View style={[styles.actionIcon, { backgroundColor: '#0066ff20' }]}>
              <Icon name="share" size={24} color="#0066ff" />
            </View>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleSetAmount}>
            <View style={[styles.actionIcon, { backgroundColor: '#00ff0020' }]}>
              <Icon name="attach-money" size={24} color="#00ff00" />
            </View>
            <Text style={styles.actionText}>Set Amount</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: '#ff00ff20' }]}>
              <Icon name="history" size={24} color="#ff00ff" />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Available Balance:</Text>
            <Text style={styles.infoValue}>
              {balance.toFixed(6)} ITC
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network:</Text>
            <Text style={styles.infoValue}>Interchained Mainnet</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wallet:</Text>
            <Text style={styles.infoValue}>{activeWallet.name}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to receive funds</Text>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Share your address or QR code with the sender
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Set an amount to generate a payment request
            </Text>
          </View>
          
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Wait for the transaction to confirm on the network
            </Text>
          </View>
        </View>

        {/* App Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {APP_INFO.name} Wallet v{APP_INFO.version}
          </Text>
          <TouchableOpacity onPress={() => {/* Open twitter */}}>
            <Text style={styles.footerLink}>
              Built by @eixaid
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Scan Button */}
      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => navigation.navigate('QRScanner')}
      >
        <Icon name="qr-code-scanner" size={28} color="#ffffff" />
        <Text style={styles.scanButtonText}>Scan</Text>
      </TouchableOpacity>

      {/* Neon Effects */}
      <View style={styles.neonEdgeLeft} />
      <View style={styles.neonEdgeRight} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff0033',
    fontSize: 18,
    marginBottom: 20,
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
  },
  scrollContent: {
    padding: 20,
  },
  qrCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  qrContainer: {
    position: 'relative',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
  },
  qrOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  qrOverlayText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
    opacity: 0.1,
  },
  amountContainer: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addressCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  addressText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  fullAddress: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  instructionsCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff0033',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#aaaaaa',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  footerText: {
    color: '#666666',
    fontSize: 12,
    marginBottom: 4,
  },
  footerLink: {
    color: '#ff0033',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  scanButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#ff0033',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  neonEdgeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  neonEdgeRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});

export default ReceiveScreen;
