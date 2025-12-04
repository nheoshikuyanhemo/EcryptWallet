import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button';
import Input from '../components/Input';
import { useWallet } from '../store/walletStore';
import { validatePassword } from '../utils/security';
import { generateMnemonic, mnemonicToSeed, generateKeyPair } from '../utils/security';
import { INTERCHAINED_NETWORK } from '../utils/constants';

const CreateWalletScreen = ({ navigation, route }) => {
  const isImport = route.params?.import || false;
  const { createWallet, importWallet } = useWallet();
  
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mnemonic, setMnemonic] = useState([]);
  const [importMnemonic, setImportMnemonic] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleCreateWallet = async () => {
    // Validate inputs
    if (!walletName.trim()) {
      Alert.alert('Error', 'Please enter a wallet name');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (isImport) {
      await handleImport();
    } else {
      // Generate new mnemonic
      const mnemonicPhrase = generateMnemonic();
      setMnemonic(mnemonicPhrase.split(' '));
      setStep(2);
    }
  };

  const handleImport = async () => {
    if (!importMnemonic.trim()) {
      Alert.alert('Error', 'Please enter your recovery phrase');
      return;
    }

    const words = importMnemonic.trim().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      Alert.alert('Error', 'Recovery phrase must be 12 or 24 words');
      return;
    }

    setLoading(true);
    try {
      const seed = mnemonicToSeed(importMnemonic);
      const keyPair = generateKeyPair(seed, INTERCHAINED_NETWORK.testnet);
      const { address } = require('bitcoinjs-lib').payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: INTERCHAINED_NETWORK.testnet
      });

      const walletData = {
        name: walletName,
        address,
        encryptedPrivateKey: 'encrypted_key_here', // Should be properly encrypted
        mnemonic: importMnemonic,
        publicKey: keyPair.publicKey.toString('hex'),
        createdAt: new Date().toISOString(),
      };

      const result = await createWallet(walletData);
      
      if (result.success) {
        Alert.alert(
          'Success',
          'Wallet imported successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
        );
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMnemonic = () => {
    setStep(3);
  };

  const handleVerifyMnemonic = () => {
    // In a real app, verify the user wrote down the mnemonic correctly
    Alert.alert(
      'Wallet Created',
      'Your wallet has been created successfully!',
      [
        {
          text: 'Go to Dashboard',
          onPress: () => navigation.navigate('Main')
        }
      ]
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {isImport ? 'Import Existing Wallet' : 'Create New Wallet'}
      </Text>
      
      <Input
        label="Wallet Name"
        value={walletName}
        onChangeText={setWalletName}
        placeholder="My Ecrypt Wallet"
        autoCapitalize="words"
      />
      
      <Input
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setPasswordError('');
        }}
        placeholder="Minimum 8 characters"
        secureTextEntry
      />
      
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}
      
      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm your password"
        secureTextEntry
      />
      
      {isImport && (
        <Input
          label="Recovery Phrase (12 or 24 words)"
          value={importMnemonic}
          onChangeText={setImportMnemonic}
          placeholder="Enter your recovery phrase"
          multiline
          numberOfLines={3}
        />
      )}
      
      <View style={styles.passwordRules}>
        <Text style={styles.rulesTitle}>Password must contain:</Text>
        <View style={styles.ruleItem}>
          <Icon 
            name={password.length >= 8 ? 'check-circle' : 'radio-button-unchecked'} 
            size={16} 
            color={password.length >= 8 ? '#00ff00' : '#666666'} 
          />
          <Text style={styles.ruleText}>At least 8 characters</Text>
        </View>
        <View style={styles.ruleItem}>
          <Icon 
            name={/[A-Z]/.test(password) ? 'check-circle' : 'radio-button-unchecked'} 
            size={16} 
            color={/[A-Z]/.test(password) ? '#00ff00' : '#666666'} 
          />
          <Text style={styles.ruleText}>Uppercase letter</Text>
        </View>
        <View style={styles.ruleItem}>
          <Icon 
            name={/[0-9]/.test(password) ? 'check-circle' : 'radio-button-unchecked'} 
            size={16} 
            color={/[0-9]/.test(password) ? '#00ff00' : '#666666'} 
          />
          <Text style={styles.ruleText}>Number</Text>
        </View>
        <View style={styles.ruleItem}>
          <Icon 
            name={/[!@#$%^&*]/.test(password) ? 'check-circle' : 'radio-button-unchecked'} 
            size={16} 
            color={/[!@#$%^&*]/.test(password) ? '#00ff00' : '#666666'} 
          />
          <Text style={styles.ruleText}>Special character</Text>
        </View>
      </View>
      
      <Button
        title={isImport ? 'Import Wallet' : 'Continue'}
        onPress={handleCreateWallet}
        variant="primary"
        size="large"
        loading={loading}
        style={styles.continueButton}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.warningBox}>
        <Icon name="warning" size={40} color="#ff9900" />
        <Text style={styles.warningTitle}>⚠️ CRITICAL SECURITY WARNING</Text>
        <Text style={styles.warningText}>
          Write down these words in order on paper and store it in a safe place.
        </Text>
        <Text style={styles.warningText}>
          Never share your recovery phrase with anyone!
        </Text>
      </View>
      
      <View style={styles.mnemonicGrid}>
        {mnemonic.map((word, index) => (
          <View key={index} style={styles.mnemonicWord}>
            <Text style={styles.wordIndex}>{index + 1}.</Text>
            <Text style={styles.wordText}>{word}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.copyButton}
        onPress={() => {/* Copy to clipboard */}}
      >
        <Icon name="content-copy" size={20} color="#ff0033" />
        <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
      </TouchableOpacity>
      
      <Button
        title="I've Written It Down Securely"
        onPress={handleConfirmMnemonic}
        variant="primary"
        size="large"
        style={styles.confirmButton}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.verifyTitle}>Verify Recovery Phrase</Text>
      <Text style={styles.verifySubtitle}>
        Select the words in the correct order to confirm you've saved them
      </Text>
      
      <View style={styles.selectedWords}>
        {/* Word selection UI would go here */}
      </View>
      
      <View style={styles.wordOptions}>
        {/* Available word options would go here */}
      </View>
      
      <Button
        title="Complete Setup"
        onPress={handleVerifyMnemonic}
        variant="primary"
        size="large"
        style={styles.completeButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#ff0033" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isImport ? 'Import Wallet' : 'Create Wallet'}
          </Text>
          <View style={{ width: 30 }} />
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(step / 3) * 100}%` }
              ]} 
            />
          </View>
          <View style={styles.stepIndicators}>
            <View style={[styles.stepIndicator, step >= 1 && styles.activeStep]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={[styles.stepIndicator, step >= 2 && styles.activeStep]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={[styles.stepIndicator, step >= 3 && styles.activeStep]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
          </View>
          <Text style={styles.stepLabel}>
            {step === 1 ? 'Setup' : step === 2 ? 'Backup' : 'Verify'}
          </Text>
        </View>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
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
  progressContainer: {
    padding: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#222222',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff0033',
    borderRadius: 2,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 8,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#ff0033',
  },
  stepNumber: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepLabel: {
    color: '#666666',
    fontSize: 14,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff0033',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  passwordRules: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  rulesTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleText: {
    color: '#aaaaaa',
    fontSize: 14,
    marginLeft: 8,
  },
  continueButton: {
    marginTop: 24,
  },
  warningBox: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff9900',
    marginBottom: 24,
  },
  warningTitle: {
    color: '#ff9900',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  warningText: {
    color: '#aaaaaa',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  mnemonicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  mnemonicWord: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#000000',
    borderRadius: 8,
    marginBottom: 12,
  },
  wordIndex: {
    color: '#666666',
    fontSize: 14,
    marginRight: 12,
    minWidth: 24,
  },
  wordText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  copyButtonText: {
    color: '#ff0033',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  confirmButton: {
    marginTop: 20,
  },
  verifyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  verifySubtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  selectedWords: {
    minHeight: 120,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#222222',
    borderStyle: 'dashed',
  },
  wordOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  completeButton: {
    marginTop: 20,
  },
});

export default CreateWalletScreen;
