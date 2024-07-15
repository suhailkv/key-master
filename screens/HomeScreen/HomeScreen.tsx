import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, AppState, TouchableWithoutFeedback, Keyboard, TouchableOpacity, InteractionManager } from 'react-native';
import { authenticateWithBiometrics, checkBiometricSupported } from '../../libs/BiometricAuth';
// use out password manager
import { getMasterPassword, saveMasterPassword } from '../../libs/SecureStore';
import useSessionTimeout from '../../libs/sessionmanagement';
import { generatePassphrase } from '../../utils/utils';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import styles2 from '../AddPassword/styles'
import {validatePassword} from '../../utils/utils'
import FadingContainer from '../../components/FadingCont';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../colors';

type AddPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Authentication'>;

type Props = {
  navigation: AddPasswordScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'Authentication'>;

};
const AuthenticationScreen: React.FC<Props> = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMasterPasswordSet, setIsMasterPasswordSet] = useState(false);
// set passphrse later
  const [passphrase, setPassphrase] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [error,setError] = useState('')
  const [info,setInfo] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  useEffect(() => {
    const checkMasterPassword = async () => {
      const storedPassword = await getMasterPassword();
      
      if (storedPassword) {
        setIsMasterPasswordSet(true);
        handleBiometricAuth()
      } else {
        setPassphrase(generatePassphrase());
      }
    };
    checkMasterPassword();
  }, []);

  const handleTimeout = () => {
    setIsAuthenticated(false);
    setSessionExpired(true);
  };

  const resetTimer = useSessionTimeout(handleTimeout);

  const handleBiometricAuth = async () => {
    const isSupported = await checkBiometricSupported();
    if (isSupported) {
      const isSuccess = await authenticateWithBiometrics();
      if (isSuccess) {
        setIsAuthenticated(true);
        resetTimer();
        navigation && navigation?.navigate('ViewPasswords',{});
      }
    } else {
    //   alert('Biometric authentication not supported');
      setError('Biometric authentication not supported')
      setTimeout(()=> setInfo('Please Login with Master Password'),4000)
    }
  };

  const handlePasswordAuth = async () => {
    const storedPassword = await getMasterPassword();
    
    if (storedPassword && storedPassword === password) {
      setIsAuthenticated(true);
      resetTimer();
      navigation.navigate('ViewPasswords',{});
    } else {
    //   alert('Incorrect password');
    setError('Incorrect password')

    }
  };

  const handleCreateMasterPassword = async () => {
    const {isValid,message} = validatePassword(password,confirmPassword)
    if (isValid) {
      await saveMasterPassword(password);
    //   set up passphrase later
    //   alert(`Master password created successfully. Your recovery passphrase is: ${passphrase}`);
    //   setIsCreatingMasterPassword(false);
      setIsMasterPasswordSet(true);
    } else {
    //   alert(message);
    setError(message)
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        resetTimer();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (sessionExpired) {
        setError('Session Expired,Please re-authenticate')
        setSessionExpired(false);navigation.navigate('Authentication')
    //   Alert.alert(
    //     'Session Expired',
    //     'Please re-authenticate',
    //     [{ text: 'OK', onPress: () => {setSessionExpired(false);navigation.navigate('Authentication')} }],
    //     { cancelable: false }
    //   );
    }
  }, [sessionExpired]);

  useEffect(() => {
    const interactionHandler = () => {
      resetTimer();
    };

    const interactionSubscription = InteractionManager.runAfterInteractions(() => {
      interactionHandler();
    });

    return () => {
      interactionSubscription.cancel();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{...styles2.container}}>
        {error && <FadingContainer message={error} timeout={4000} errFn={setError}/>}
        {info && <FadingContainer message={info} timeout={2000} errFn={setInfo}containerStyle={{backgroundColor:'blue'}} />}
        {!isMasterPasswordSet ? (
          <>
            
            <Text style={styles.title}>Create Master Password</Text>
            <View style={styles2.inputContainer}>
        <Text style={styles2.label}>Password</Text>
        <TextInput
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          style={{...styles.input,paddingRight:40}}
          placeholderTextColor={Colors.muted}
        />
      </View>
           
      <TouchableOpacity onPress={()=> setIsPasswordVisible(val=>!val)} style={{padding: 5,
        position:'relative',
        top:-90,
        right:-320,
        margin:0,
        zIndex:1000}}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={24}
            color="#999"
          />
        </TouchableOpacity>
        <View style={{...styles2.inputContainer,position:'relative',top:-40}}>
        <Text style={styles2.label}>Confirm Password</Text>
        <TextInput
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor={Colors.muted}
        />
      </View>
            <TouchableOpacity style={{...styles2.saveButton,position:'relative',top:-40}} onPress={handleCreateMasterPassword}>
                <Text style={styles2.saveButtonText}>Create Master Password</Text>
            </TouchableOpacity>
            {/* {set up passphrase later} */}
            <Text style={styles.passphrase}>Store this passphrase securely: {passphrase}</Text>
          </>
        ) : (
          <>
            {/* <Text style={styles.title}>Authenticate</Text> */}
            <TouchableOpacity style={styles2.saveButton} onPress={handleBiometricAuth}>
                <Text style={styles2.saveButtonText}>USE BIOMETRICS</Text>
            </TouchableOpacity>
            {/* <Button title="Use Biometrics" onPress={handleBiometricAuth} /> */}
            {/* <Text style={styles.or}>OR</Text> */}
            {/* <TextInput
            style={{...styles2.input, marginBottom:20,width:310}}

              placeholder="Enter Master Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            /> */}
            {/* <Button title="Authenticate with Password" onPress={handlePasswordAuth} /> */}
            {/* <TouchableOpacity style={styles2.saveButton} onPress={handlePasswordAuth}> */}
                {/* <Text style={styles2.saveButtonText}>Authenticate with Master Password</Text>
            </TouchableOpacity> */}
            {/* {isAuthenticated && <Text style={styles.success}>Authenticated Successfully!</Text>} */}
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
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
  or: {
    marginVertical: 8,
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    borderRadius: 4,
  },
  success: {
    marginTop: 16,
    fontSize: 16,
    color: 'green',
  },
  passphrase: {
    marginTop: 16,
    fontSize: 14,
    color: 'red',
  },
});

export default AuthenticationScreen;
