import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useWallet } from '../store/walletStore';
import { formatCurrency, formatAddress } from '../utils/helpers';
import Card from '../components/Card';
import Button from '../components/Button';
import { APP_INFO } from '../utils/constants';

const DashboardScreen = ({ navigation }) => {
  const { 
    activeWallet, 
    balance, 
    tokens, 
    transactions, 
    refreshData, 
    isLoading 
  } = useWallet();
  
  const [refreshing, setRefreshing] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  
  useEffect(() => {
    // Start pulsing animation for balance
    const pulse = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.02,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);
    
    Animated.loop(pulse).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleSend = () => {
    navigation.navigate('Send');
  };

  const handleReceive = () => {
    navigation.navigate('Receive');
  };

  const handleTokens = () => {
    navigation.navigate('Tokens');
  };

  const handleSwap = () => {
    // Navigate to swap screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={30} color="#ff0033" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>ECRYPT</Text>
          {activeWallet && (
            <Text style={styles.walletName}>
              {activeWallet.name}
            </Text>
          )}
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={30} color="#ff0033" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff0033']}
            tintColor="#ff0033"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <Animated.View style={[styles.balanceCard, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(balance)} ITC
          </Text>
          <Text style={styles.balanceFiat}>
            ≈ ${(balance * 100).toFixed(2)} USD
          </Text>
          
          {activeWallet && (
            <View style={styles.addressContainer}>
              <Text style={styles.addressLabel}>
                {formatAddress(activeWallet.address)}
              </Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => {/* Copy to clipboard */}}
              >
                <Icon name="content-copy" size={16} color="#ff0033" />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
            <View style={[styles.actionIcon, styles.sendIcon]}>
              <Icon name="send" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleReceive}>
            <View style={[styles.actionIcon, styles.receiveIcon]}>
              <Icon name="qr-code-scanner" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleTokens}>
            <View style={[styles.actionIcon, styles.tokenIcon]}>
              <Icon name="token" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Tokens</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleSwap}>
            <View style={[styles.actionIcon, styles.swapIcon]}>
              <Icon name="swap-horiz" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Swap</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <Card variant="surface" elevation="small" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {transactions.length > 0 ? (
            transactions.slice(0, 3).map((tx, index) => (
              <View key={tx.id} style={styles.transactionItem}>
                <View style={[
                  styles.txIconContainer,
                  tx.type === 'received' ? styles.receivedIcon : styles.sentIcon
                ]}>
                  <Icon 
                    name={tx.type === 'received' ? 'call-received' : 'call-made'} 
                    size={20} 
                    color="#ffffff" 
                  />
                </View>
                
                <View style={styles.txDetails}>
                  <Text style={styles.txType}>
                    {tx.type === 'received' ? 'Received' : 'Sent'}
                  </Text>
                  <Text style={styles.txAddress}>
                    {formatAddress(tx.address)}
                  </Text>
                </View>
                
                <View style={styles.txAmountContainer}>
                  <Text style={[
                    styles.txAmount,
                    tx.type === 'received' ? styles.receivedAmount : styles.sentAmount
                  ]}>
                    {tx.type === 'received' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </Text>
                  <Text style={styles.txStatus}>
                    {tx.confirmed ? 'Confirmed' : 'Pending'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="receipt" size={40} color="#333333" />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
            </View>
          )}
        </Card>

        {/* Token Balances */}
        <Card variant="surface" elevation="small" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Tokens</Text>
            <TouchableOpacity onPress={handleTokens}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {tokens.length > 0 ? (
            tokens.slice(0, 3).map((token, index) => (
              <TouchableOpacity 
                key={token.id} 
                style={styles.tokenItem}
                onPress={() => navigation.navigate('TokenDetail', { token })}
              >
                <View style={styles.tokenIcon}>
                  <Text style={styles.tokenSymbol}>
                    {token.symbol.substring(0, 2)}
                  </Text>
                </View>
                
                <View style={styles.tokenInfo}>
                  <Text style={styles.tokenName}>{token.name}</Text>
                  <Text style={styles.tokenSymbolFull}>{token.symbol}</Text>
                </View>
                
                <View style={styles.tokenBalance}>
                  <Text style={styles.tokenAmount}>
                    {formatCurrency(token.balance, token.decimals)}
                  </Text>
                  <Text style={styles.tokenValue}>
                    ≈ ${(token.balance * 0.1).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="account-balance-wallet" size={40} color="#333333" />
              <Text style={styles.emptyStateText}>No tokens yet</Text>
              <Button
                title="Explore Tokens"
                onPress={handleTokens}
                variant="outline"
                size="small"
                style={styles.exploreButton}
              />
            </View>
          )}
        </Card>

        {/* App Info Footer */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>
            {APP_INFO.name} v{APP_INFO.version}
          </Text>
          <TouchableOpacity onPress={() => {/* Open twitter */}}>
            <Text style={styles.appInfoLink}>
              by @eixaid
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Receive')}
      >
        <Icon name="qr-code" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Neon Effects */}
      <View style={styles.neonCornerTL} />
      <View style={styles.neonCornerTR} />
      <View style={styles.neonCornerBL} />
      <View style={styles.neonCornerBR} />
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
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#ff0033',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  walletName: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: '#111111',
    margin: 20,
    padding: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#ff0033',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  balanceFiat: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  addressLabel: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  copyButton: {
    padding: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
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
  sendIcon: {
    backgroundColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  receiveIcon: {
    backgroundColor: '#0066ff',
    shadowColor: '#0066ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  tokenIcon: {
    backgroundColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  swapIcon: {
    backgroundColor: '#ff00ff',
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  seeAllText: {
    color: '#ff0033',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  txIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  receivedIcon: {
    backgroundColor: '#00ff0020',
  },
  sentIcon: {
    backgroundColor: '#ff003320',
  },
  txDetails: {
    flex: 1,
  },
  txType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  txAddress: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  txAmountContainer: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  receivedAmount: {
    color: '#00ff00',
  },
  sentAmount: {
    color: '#ff0033',
  },
  txStatus: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  tokenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  tokenIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff0033',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tokenSymbol: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  tokenSymbolFull: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  tokenBalance: {
    alignItems: 'flex-end',
  },
  tokenAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tokenValue: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    color: '#666666',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  exploreButton: {
    marginTop: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#222222',
    marginHorizontal: 20,
    marginTop: 10,
  },
  appInfoText: {
    color: '#666666',
    fontSize: 12,
  },
  appInfoLink: {
    color: '#ff0033',
    fontSize: 12,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff0033',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  neonCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  neonCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  neonCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  neonCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#ff0033',
    shadowColor: '#ff0033',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
});

export default DashboardScreen;
