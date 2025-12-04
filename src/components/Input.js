import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  success,
  icon,
  onIconPress,
  multiline = false,
  style,
  inputStyle,
  ...props
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (success) return theme.colors.success;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  const getIconColor = () => {
    if (error) return theme.colors.error;
    if (success) return theme.colors.success;
    if (isFocused) return theme.colors.primary;
    return theme.colors.textMuted;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: getBorderColor(),
          borderWidth: 2,
          borderRadius: theme.borders.radius.medium,
        }
      ]}>
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={getIconColor()}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              flex: 1,
              paddingLeft: icon ? 8 : 16,
              paddingRight: secureTextEntry ? 40 : 16,
            },
            multiline && { height: 100, textAlignVertical: 'top' },
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={theme.colors.primary}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}
          >
            <Icon
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
        
        {onIconPress && !secureTextEntry && (
          <TouchableOpacity onPress={onIconPress} style={styles.rightIcon}>
            <Icon
              name="send"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || success) && (
        <View style={styles.messageContainer}>
          <Icon
            name={error ? 'error' : 'check-circle'}
            size={14}
            color={error ? theme.colors.error : theme.colors.success}
            style={styles.messageIcon}
          />
          <Text style={[
            styles.message,
            { color: error ? theme.colors.error : theme.colors.success }
          ]}>
            {error || success}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIcon: {
    padding: 8,
    marginRight: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageIcon: {
    marginRight: 4,
  },
  message: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Input;
