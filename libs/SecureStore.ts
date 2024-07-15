import * as SecureStore from 'expo-secure-store';

const MASTER_PASSWORD_KEY = 'master_password';

export const saveMasterPassword = async (password: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(MASTER_PASSWORD_KEY, password);
    console.log('saved',MASTER_PASSWORD_KEY,password);
    
  } catch (error) {
    console.error('Failed to save master password:', error);
  }
};

export const getMasterPassword = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(MASTER_PASSWORD_KEY);
  } catch (error) {
    console.error('Failed to retrieve master password:', error);
    return null;
  }
};

export const deleteMasterPassword = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(MASTER_PASSWORD_KEY);
  } catch (error) {
    console.error('Failed to delete master password:', error);
  }
}
