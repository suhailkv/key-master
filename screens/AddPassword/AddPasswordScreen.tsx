import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../colors';
import FadingContainer from '../../components/FadingCont'
import * as SecureStore from 'expo-secure-store';
import {savePassword as savePass,getAllPasswords} from '../../libs/passwordManager'
import styles from './styles';
type AddPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPassword'>;

type Props = {
  navigation: AddPasswordScreenNavigationProp;
};

const AddPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };
  const savePassword = async () => {
    if(!_validateEntry()) return
    try {
      await savePass({password,website,username})
    } catch (error) {
      console.log(error);
      setError('Something went wrong');
      return
    }
    navigation.goBack();
  };
  function _validateEntry() {
    if (!website.trim()) {
        setError('Website name cannot be empty.');
        return false;
    }
    if (!password.trim()) {
        setError('Password cannot be empty.');
        return false;
    }
    return true
  }
  return (
    <View style={styles.container}>
         {error && (
        <FadingContainer message={error} timeout={5000} errFn={setError} />
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          placeholder="Enter Website/App name"
          value={website}
          onChangeText={setWebsite}
          style={styles.input}
          placeholderTextColor={Colors.muted}
        />
      </View>
      <TouchableOpacity style={styles.arrowContainer} onPress={toggleAdditionalFields}>
        <Text style={styles.arrow}>{!showAdditionalFields ? '+' : '-'}</Text>
      </TouchableOpacity>
      
      {showAdditionalFields && (
         <View style={styles.inputContainer}>
         <Text style={styles.label}>Username</Text>
         <TextInput
           placeholder="Enter username"
           value={username}
           onChangeText={setUsername}
           style={styles.input}
           placeholderTextColor={Colors.muted}
         />
       </View>
      )}
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


export default AddPasswordScreen;
