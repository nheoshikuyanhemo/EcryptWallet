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
import { formatCurrency, validateAddress, validateAmount } from '../utils/helpers';
import { FEES } from '../utils/constants';

const SendScreen = ({ navigation }) => {
  const { activeWallet, balance, sendTransaction, sendToken } = useWallet();
  
  const [step, setStep] = useState(1); // 1: Address, 2: Amount, 3: Confirm
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(null); // null = ITC
  const [fee, setFee] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  
  const isToken = selectedToken !== null;
  const availableBalance = isToken 
    ? (selectedToken?.balance || 0)
    : balance;

  const handleContinue = () => {
    if (step === 1) {
      if (!validateAddress(toAddress)) {
        Alert.alert('Error', 'Please enter a valid Interchained address');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!validateAmount(amount, availableBalance)) {
        Alert.alert('Error', `Insufficient ${isToken ? selectedToken.symbol : 'ITC'} balance`);
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSend = async () => {
    setLoading(true);
    try {
      let result;
      if (isToken) {
        result = await sendToken(
          selectedToken.id,
          toAddress,
          parseFloat(amount)
        );
      } else {
        result = await sendTransaction(
          toAddress,
          parseFloat(amount),
          fee
        );
      }
      
      if (result.success) {
        Alert.alert(
          'Success',
          `Transaction sent!\nTXID: ${result.txid}`,
          [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to send transaction');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Send to Address</Text>
      
      <Input
        label="Recipient Address"
        value={toAddress}
        onChangeText={setToAddress}
        placeholder="Enter Interchained address"
        multiline
        numberOfLines={2}
      />
      
      <TouchableOpacity style={styles.qrButton}>
        <Icon name="qr-code-scanner" size={24} color="#ff0033" />
        <Text style={styles.qrButtonText}>Scan QR Code</Text>
      </TouchableOpacity>
      
      <View style={styles.recentContainer}>
        <Text style={styles.sectionLabel}>Recent Addresses</Text>
        {/* Recent addresses list */}
      </View>
      
      <Button
        title="Continue"
        onPress={handleContinue}
        variant="primary"
        size="large"
        style={styles.continueButton}
        disabled={!toAddress.trim()}
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Amount</Text>
      
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          {formatCurrency(availableBalance, isToken ? selectedToken.decimals : 6)} 
          {isToken ? ` ${selectedToken.symbol}` : ' ITC'}
        </Text>
      </View>
      
      <Input
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        placeholder={`0.00 ${isToken ? selectedToken.symbol : 'ITC'}`}
        keyboardType="decimal-pad"
        icon="attach-money"
      />
      
      <View style={styles.quickAmounts}>
        <TouchableOpacity 
          style={styles.quickAmount}
          onPress={() => setAmount((availableBalance * 0.25).toString())}
        >
          <Text style={styles.quickAmountText}>25%</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAmount}
          onPress={() => setAmount((availableBalance * 0.5).toString())}
        >
          <Text style={styles.quickAmountText}>50%</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAmount}
          onPress={() => setAmount((availableBalance * 0.75).toString())}
        >
          <Text style={styles.quickAmountText}>75%</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAmount}
          onPress={() => setAmount(availableBalance.toString())}
        >
          <Text style={styles.quickAmountText}>MAX</Text>
        </TouchableOpacity>
      </View>
      
      <Input
        label="Note (Optional)"
        value={note}
        onChangeText={setNote}
        placeholder="Add a note for this transaction"
      />
      
      <View style={styles.feeSelector}>
        <Text style={styles.sectionLabel}>Transaction Fee</Text>
        <View style={styles.feeOptions}>
          <TouchableOpacity 
            style={[styles.feeOption, fee === 'LOW' && styles.feeOptionActive]}
            onPress={() => setFee('LOW')}
          >
            <Text style={[styles.feeOptionText, fee === 'LOW' && styles.feeOptionTextActive]}>
              Low
            </Text>
            <Text style={styles.feeAmount}>{FEES.LOW} ITC</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.feeOption, fee === 'MEDIUM' && styles.feeOptionActive]}
            onPress={() => setFee('MEDIUM')}
          >
            <Text style={[styles.feeOptionText, fee === 'MEDIUM' && styles.feeOptionTextActive]}>
              Medium
            </Text>
            <Text style={styles.feeAmount}>{FEES.MEDIUM} ITC</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.feeOption, fee === 'HIGH' && styles.feeOptionActive]}
            onPress={() => setFee('HIGH')}
          >
            <Text style={[styles.feeOptionText, fee === 'HIGH' && styles.feeOptionTextActive]}>
              High
            </Text>
            <Text style={styles.feeAmount}>{FEES.HIGH} ITC</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Button
        title="Continue"
        onPress={handleContinue}
        variant="primary"
        size="large"
        style={styles.continueButton}
        disabled={!amount || parseFloat(amount) <= 0}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirm Transaction</Text>
      
      <View style={styles.confirmationCard}>
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>From:</Text>
          <Text style={styles.confirmationValue}>
            {activeWallet?.address.substring(0, 12)}...{activeWallet?.address.substring(activeWallet.address.length - 8)}
          </Text>
        </View>
        
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>To:</Text>
          <Text style={styles.confirmationValue}>
            {toAddress.substring(0, 12)}...{toAddress.substring(toAddress.length - 8)}
          </Text>
        </View>
        
        <View style={styles.confirmationDivider} />
        
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationLabel}>Amount:</Text>
          <Text style={styles.confirmationAmount}>
            {formatCurrency(amount, isToken ? selectedToken.decimals : 6)} 
            {isToken ? ` ${selectedToken.symbol}` : ' ITC'}
          </Text>
        </View>
        
        {!isToken && (
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Network Fee:</Text>
            <Text style={styles.confirmationFee}>{FEES[fee]} ITC</Text>
          </View>
        )}
        
        {note && (
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Note:</Text>
            <Text style={styles.confirmationNote}>{note}</Text>
          </View>
        )}
        
        <View style={styles.confirmationDivider} />
        
        {!isToken && (
          <View style={styles.confirmationRow}>
            <Text style={styles.confirmationLabel}>Total:</Text>
            <Text style={styles.confirmationTotal}>
              {formatCurrency(parseFloat(amount) + FEES[fee])} ITC
            </Text>
          </View>
        )}
      </View>
      
      <Button
        title="Confirm & Send"
        onPress={handleSend}
        variant="primary"
        size="large"
        loading={loading}
        style={styles.sendButton}
      />
      
      <Button
        title="Edit Transaction"
        onPress={() => setStep(2)}
        variant="outline"
        size="large"
        style={styles.editButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-back" size={30} color="#ff0033" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send</Text>
        <TouchableOpacity onPress={() => setSelectedToken(null)}>
          <Icon name="token" size={30} color="#ff0033" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.progressContainer}>
          <View style={styles.progressSteps}>
            <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]}>
              <Text style={styles.progressStepText}>1</Text>
              <Text style={styles.progressStepLabel}>Address</Text>
            </View>
            <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
            <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]}>
              <Text style={styles.progressStepText}>2</Text>
              <Text style={styles.progressStepLabel}>Amount</Text>
            </View>
            <View style={[styles.progressLine, step >= 3 && styles.progressLineActive]} />
            <View style={[styles.progressStep, step >= 3 && styles.progressStepActive]}>
              <Text style={styles.progressStepText}>3</Text>
              <Text style={styles.progressStepLabel}>Confirm</Text>
            </View>
          </View>
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
  progressContainer: {
    padding: 20,
  },
  progressSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#222222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStepActive: {
    backgroundColor: '#ff0033',
  },
  progressStepText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressStepLabel: {
    position: 'absolute',
    top: 40,
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    minWidth: 60,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#222222',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#ff0033',
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
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  qrButtonText: {
    color: '#ff0033',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  recentContainer: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 12,
  },
  continueButton: {
    marginTop: 24,
  },
  balanceCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#222222',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  quickAmount: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  quickAmountText: {
    color: '#ff0033',
    fontSize: 14,
    fontWeight: '500',
  },
  feeSelector: {
    marginTop: 20,
  },
  feeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feeOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  feeOptionActive: {
    backgroundColor: '#ff003320',
    borderWidth: 1,
    borderColor: '#ff0033',
  },
  feeOptionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  feeOptionTextActive: {
    color: '#ff0033',
  },
  feeAmount: {
    fontSize: 12,
    color: '#666666',
  },
  confirmationCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmationLabel: {
    fontSize: 14,
    color: '#666666',
  },
  confirmationValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  confirmationAmount: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  confirmationFee: {
    fontSize: 14,
    color: '#ff0033',
  },
  confirmationNote: {
    fontSize: 14,
    color: '#aaaaaa',
    fontStyle: 'italic',
  },
  confirmationTotal: {
    fontSize: 20,
    color: '#ff0033',
    fontWeight: 'bold',
  },
  confirmationDivider: {
    height: 1,
    backgroundColor: '#222222',
    marginVertical: 16,
  },
  sendButton: {
    marginTop: 24,
  },
  editButton: {
    marginTop: 12,
  },
});

export default SendScreen;
