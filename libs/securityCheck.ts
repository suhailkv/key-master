import * as Device from 'expo-device';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';

export async function checkDeviceSecurity(): Promise<boolean> {

    if (!Device.isDevice) { // Emulator check is most important
      throw Error('Not secure') 
    }
    return true;
}

// Helper function to calculate SHA-256 hash of a file : TODO implement later
async function calculateFileHash(filePath: string): Promise<string> {
  const fileContent = await FileSystem.readAsStringAsync(filePath);
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, fileContent);
  return digest;
}

