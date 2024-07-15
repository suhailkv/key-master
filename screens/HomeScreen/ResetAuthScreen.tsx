import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { saveMasterPassword, deleteMasterPassword, getMasterPassword } from '../../libs/SecureStore';

const ResetAuthScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (newPassword === confirmPassword) {
      await deleteMasterPassword();
      await saveMasterPassword(newPassword);
      alert('Master password has been reset');
    } else {
      alert('Passwords do not match');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Master Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter New Master Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Master Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default ResetAuthScreen;
