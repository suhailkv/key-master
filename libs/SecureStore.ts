import * as SecureStore from 'expo-secure-store';

export async function saveCredentials(key:string,credentials: string): Promise<boolean> {
    try {
        await SecureStore.setItemAsync(key, credentials);
        return true;
    } catch (error) {
        console.error('Failed to save credentials:', error);
        return false; 
    }
}
export async function getCredentials(key:string): Promise<string | null> {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error('Failed to get credentials:', error);
        return null;
    }
}
export async function deleteCredentials(key:string): Promise<boolean> {
    try {
        await SecureStore.deleteItemAsync(key);
        return true;
    } catch (error) {
        console.error('Failed to delete credentials:', error);
        return false;
    }
}
