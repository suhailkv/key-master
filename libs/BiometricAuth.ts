import * as LocalAuthentication from 'expo-local-authentication';

export const checkBiometricSupported = async (): Promise<boolean> => {
  const isHardwareSupported = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return isHardwareSupported && isEnrolled;
};

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      fallbackLabel: 'Use Passcode',
    });
    return result.success;
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    return false;
  }
};
