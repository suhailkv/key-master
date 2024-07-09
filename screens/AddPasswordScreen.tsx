import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../colors';
import FadingContainer from '../components/FadingCont'
type AddPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPassword'>;

type Props = {
  navigation: AddPasswordScreenNavigationProp;
};

const AddPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const savePassword = async () => {
    if (!website.trim()) {
        setError('Website name cannot be empty.');
        return;
      }
  
      if (!password.trim()) {
        setError('Password cannot be empty.');
        return;
      }
    const storedPasswords = await AsyncStorage.getItem('passwords');
    const passwords = storedPasswords ? JSON.parse(storedPasswords) : [];
    passwords.push({ website, password, isVisible: false });
    await AsyncStorage.setItem('passwords', JSON.stringify(passwords));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
         {error && (
        <FadingContainer message={error} timeout={5000} errFn={setError} />
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          placeholder="Enter website name"
          value={website}
          onChangeText={setWebsite}
          style={styles.input}
          placeholderTextColor={Colors.muted}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor={Colors.muted}
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={savePassword}>
        <Ionicons name="save-outline" size={24} color={Colors.white} />
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.light,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: Colors.dark,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 50,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  errorContainer:   {
    position: 'absolute',
    top: 20, // Adjust as needed
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  errorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddPasswordScreen;
