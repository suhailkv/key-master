import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device'
import CONSTANTS from '../constants';

const SESSION_TIMEOUT = 1 * 60 * 1000;  // 15 minutes
const TOKEN_EXPIRATION_KEY = 'tokenExpiration';

let authToken: string | null = null;
let sessionTimeoutTimer: NodeJS.Timeout | null = null;

async function initializeSession():Promise<{result:boolean,message?:string}> {
    const isSecure = Device.isDevice; 
    try {
        if (!isSecure) {
            await clearAuthToken()
            return  {result : false , message:'Something went wrong'}
        }
        authToken = await SecureStore.getItemAsync(CONSTANTS.AUTH_TOKEN_KEY);
        if (authToken) {
            if (await verifyTokenIntegrity(authToken)) {
                startSessionTimeoutTimer();
                return {result:true}
            }
        }
        await clearAuthToken();
        return  {result:false , message:'Please re-login again'}
    } catch (error) {
        console.error('Error initializing session:', error);
        return  {result : false,message:'Server Error'}
    }
}
function startSessionTimeoutTimer() {
    sessionTimeoutTimer = setTimeout(() => {
        authToken = null;
        AsyncStorage.removeItem(CONSTANTS.AUTH_TOKEN_KEY);
    }, SESSION_TIMEOUT);
}
function resetSessionTimeoutTimer() {
    if(!sessionTimeoutTimer) return
    clearTimeout(sessionTimeoutTimer);
    startSessionTimeoutTimer();
}

async function generateAuthToken() {
    const randomBytes = (await Crypto.getRandomBytesAsync(32)).toString();
    return randomBytes;
}

// Token Storage
async function storeAuthToken(token: string) : Promise<boolean>{
    try {
        const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, token);
        await SecureStore.setItemAsync(CONSTANTS.AUTH_TOKEN_KEY, token);  
        await SecureStore.setItemAsync(CONSTANTS.AUTH_TOKEN_KEY + "_hash", digest);

        // TODO:Implemet later
        // const expirationTime = Date.now() + SESSION_TIMEOUT;
        // await AsyncStorage.setItem(TOKEN_EXPIRATION_KEY, expirationTime.toString());
        return true
    } catch (error) {
        console.error(error)
        return false
    }
  
}
async function getAuthToken():Promise<string | null> {
    return await SecureStore.getItemAsync(CONSTANTS.AUTH_TOKEN_KEY); 
}

// Token Verification
async function verifyTokenIntegrity(currentToken: string) {
    const storedTokenHash = await SecureStore.getItemAsync(CONSTANTS.AUTH_TOKEN_KEY + "_hash");
    if (!storedTokenHash) {
        throw new Error("No token hash found.");
    }
    
    const currentTokenHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, currentToken);
    if (storedTokenHash !== currentTokenHash) {
        throw new Error("Token has been altered.");
    }
    // (Optional) Check for expiration
    // const tokenExpiration = await AsyncStorage.getItem(TOKEN_EXPIRATION_KEY);
    // if (tokenExpiration && Date.now() > parseInt(tokenExpiration, 10)) {
    //     throw new Error("Token expired.");
    // }

  return true; 
}
async function deleteAll(){
    await SecureStore.deleteItemAsync(CONSTANTS.AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(CONSTANTS.AUTH_TOKEN_KEY + '_hash');
} 
async function clearAuthToken() {
    await SecureStore.deleteItemAsync(CONSTANTS.AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(`${CONSTANTS.AUTH_TOKEN_KEY}_hash`);
    authToken = null;
    if(sessionTimeoutTimer) clearTimeout(sessionTimeoutTimer);
  }
AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && authToken) {
        resetSessionTimeoutTimer();
    } else if (nextAppState.match(/inactive|background/) && authToken) {
        resetSessionTimeoutTimer();
        // TODO:later
    }
});
export { generateAuthToken, storeAuthToken, initializeSession, resetSessionTimeoutTimer, getAuthToken, verifyTokenIntegrity, deleteAll, clearAuthToken };
