import * as SecureStore from 'expo-secure-store';
import {PasswordEntry,StoredPassword} from '../types'

const savePassword = async ({id,password, website, username}:StoredPassword): Promise<string> => {
    try {
        let ts;
        id ? ts = id:ts = Date.now().toString();
        const entry: StoredPassword = { id:ts, website ,username, password };
        SecureStore.setItem(ts, JSON.stringify(entry));
        if(id == ts) return id
        const keys:string[] = await _getAllKeys();
        keys.push(ts);
        await SecureStore.setItemAsync('password_keys', JSON.stringify(keys));
        return ts;
    } catch (error) {
        throw Error()
    }
};

const getAllPasswords = async (): Promise<StoredPassword[]> => {
    try {
        const keys = await _getAllKeys();
        if (!keys.length) return [];
      
        const passwords: StoredPassword[] = [];
        for (const key of keys) {
            const entryJson = await SecureStore.getItemAsync(key);
            if (entryJson) {
                const passwordEntry: StoredPassword = JSON.parse(entryJson);
                const securePasswordEntry: StoredPassword = {...passwordEntry,password: '' };
                passwords.push(securePasswordEntry);
            }
        }
        return passwords.sort((a,b)=>{
            if(b.id && a.id) return parseInt(b.id) - parseInt(a.id)
            else return 1
        })
    } catch (error) {
        throw Error()
    }
};

const getPasswordById = async (id: string): Promise<PasswordEntry | null> => {
    try {
        const entryJson = await SecureStore.getItemAsync(id);
        const entry:PasswordEntry = entryJson ? JSON.parse(entryJson) : null
        return entry
    } catch (error) {
        throw Error()
    }
};
async function deleteEntry(id: string): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(id);
    } catch (error) {
        console.error('Error deleting entry:', error);
        throw error;
    }
  }
async function updateEntry({id, password, website,username}: StoredPassword): Promise<void> {
    try {
        const entryString = id && await SecureStore.getItemAsync(id);
        if (entryString) {
            const entry: PasswordEntry = JSON.parse(entryString);
            const updatedEntry: PasswordEntry = {...entry,password,website,username};
            await SecureStore.setItemAsync(id, JSON.stringify(updatedEntry));
        } else {
            throw new Error('Entry not found');
        }
    } catch (error) {
        console.error('Error updating entry:', error);
        throw Error();
    }
}
async function deleteAll():Promise<boolean> {
    try {
        const keys = await _getAllKeys();
        for (const key of keys) await deleteEntry(key)
        return true
    } catch (error) {
        throw Error()
    }
}
async function _getAllKeys() :Promise<[]>{
    try {
        const keysStr = await SecureStore.getItemAsync('password_keys');
        const keys = keysStr ? JSON.parse(keysStr): []
        return keys
    } catch (error) {
        throw Error() 
    }
}

export { savePassword, getAllPasswords, getPasswordById ,updateEntry,deleteEntry,deleteAll};
