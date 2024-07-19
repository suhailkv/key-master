import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, AppState, TouchableWithoutFeedback, Keyboard, TouchableOpacity, InteractionManager, Button } from 'react-native';
import { authenticateWithBiometrics, checkBiometricSupported } from '../../libs/BiometricAuth';
import { getMasterPassword, saveMasterPassword } from '../../libs/MasterPass';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import {validatePassword} from '../../utils/utils'
import FadingContainer from '../../components/FadingCont';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../colors';
import {generateAuthToken, initializeSession, resetSessionTimeoutTimer, storeAuthToken} from '../../libs/tokenHandler'
import LoadingScreen from '../../components/Loader';

type AddPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Authentication'>;

type Props = {
    navigation: AddPasswordScreenNavigationProp;
    route: RouteProp<RootStackParamList, 'Authentication'>;
};
const AuthenticationScreen: React.FC<Props> = ({navigation}) => {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isMasterPasswordSet, setIsMasterPasswordSet] = useState<boolean>(false);
    const [sessionExpired, setSessionExpired] = useState<boolean>(false);
    const [error,setError] = useState<string>('')
    const [info,setInfo] = useState<string>('')
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [loading,setLoading] = useState<boolean>(true)

    useEffect(() => {
        async function init(){

            if((await getMasterPassword())) setIsMasterPasswordSet(true)
            if (sessionExpired) {
                setError('Session Expired,Please re-authenticate')
                setSessionExpired(false);navigation.navigate('Authentication')
            }
        }
        init()
    }, [sessionExpired]);

    const handleBiometricAuth = async () => {
        const isSupported = await checkBiometricSupported();
        if (isSupported) {
            const isSuccess = await authenticateWithBiometrics();
            if (isSuccess) {
                const token = await generateAuthToken()
                await storeAuthToken(token)
                resetSessionTimeoutTimer();
                setIsAuthenticated(true);
                navigation && navigation?.navigate('ViewPasswords',{});
            }
            else setError('Authentication Failed')
        } else {
            setError('Biometric authentication not supported')
            setTimeout(()=> setInfo('Please Login with Master Password'),4000)
        }
    };

    const handlePasswordAuth = async () => {
        try {
            const storedPassword = await getMasterPassword();
            if (storedPassword && storedPassword === password) {
                const token = await generateAuthToken()
                await storeAuthToken(token)
                resetSessionTimeoutTimer();
                setIsAuthenticated(true);
                navigation && navigation?.navigate('ViewPasswords',{});
            } else {
                setError('Incorrect password')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreateMasterPassword = async () => {
        const {isValid,message} = validatePassword(password,confirmPassword)
        if (isValid) {
        await saveMasterPassword(password);
        //   set up passphrase later
        setIsMasterPasswordSet(true);
        } else {
        setError(message)
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                {loading && <LoadingScreen isLoading= {setLoading}/> }
                {!loading && error && <FadingContainer message={error} timeout={4000} errFn={setError}/>}
                {!loading && info && <FadingContainer message={info} timeout={2000} errFn={setInfo}containerStyle={{backgroundColor:'blue'}} />}
                {!loading && !isMasterPasswordSet ? (
                    <>
                        
                        <Text style={styles.title}>Create Master Password</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput placeholder="Enter password" value={password} onChangeText={setPassword} secureTextEntry={!isPasswordVisible} style={{...styles.input,paddingRight:40}} placeholderTextColor={Colors.muted} />
                        </View>
                
                        <TouchableOpacity onPress={()=> setIsPasswordVisible(val=>!val)} style={styles.eyeContainer}>
                            <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="#999" />
                        </TouchableOpacity>
                        <View style={{...styles.inputContainer,position:'relative',top:-40}}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <TextInput placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry style={styles.input} placeholderTextColor={Colors.muted} />
                        </View>
                        <TouchableOpacity style={{...styles.button,position:'relative',top:-40}} onPress={handleCreateMasterPassword}>
                            <Text style={styles.buttonText}>Create Master Password</Text>
                        </TouchableOpacity>
                    </>
                ) : !loading && (
                    <>
                        <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
                            <Text style={styles.buttonText}>USE BIOMETRICS</Text>
                        </TouchableOpacity>
                        <Text style={styles.or}>OR</Text>
                        <TextInput style={{...styles.input, marginBottom:20}} placeholder="Enter Master Password" secureTextEntry value={password} onChangeText={setPassword} />
                        <TouchableOpacity style={styles.button} onPress={handlePasswordAuth}>
                            <Text style={styles.buttonText}>Authenticate with Master Password</Text>
                        </TouchableOpacity>
                        {isAuthenticated && <Text style={styles.success}>Authenticated Successfully!</Text>}
                    </>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
     container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: Colors.light,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    or: {
        marginVertical: 8,
        fontSize: 16,
        alignSelf:'center'
    },
    input: {
           height: 40,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: Colors.dark,
        paddingRight:40
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
    eyeContainer: {padding: 5,
        position:'relative',
        top:-90,
        right:-320,
        margin:0,
        zIndex:1000
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
    button: {
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
    buttonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 10,
    },
    // input: {
    //     height: 40,
    //     borderColor: Colors.border,
    //     borderWidth: 1,
    //     borderRadius: 5,
    //     paddingHorizontal: 10,
    //     color: Colors.dark,
    //     paddingRight:40
    // },

});

export default AuthenticationScreen;
