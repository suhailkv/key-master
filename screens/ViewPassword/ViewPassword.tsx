import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../colors';
import * as Clipboard from 'expo-clipboard';
import FadingContainer from '../../components/FadingCont';
import styles from './styles';
import { getAllPasswords ,getPasswordById} from '../../libs/passwordManager';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'ViewPasswords'>;
};

type PasswordItem = {
    id:string
    website: string;
    password: string;
    isVisible: boolean;
    username ? :string;
};

const ViewPassword: React.FC<Props> = ({ navigation }) => {
    const [passwords, setPasswords] = useState<PasswordItem[]>([]);
    const [info, setInfo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadPasswords = async () => {
        try {
            let storedPasswords:PasswordItem[] = (await getAllPasswords()).map(passObj=> {return {...passObj,isVisible:false}});
            if (storedPasswords) setPasswords(storedPasswords); 
        } catch (error) {
            setError('Something went wrong')
        }
        
    };

    useFocusEffect(
        useCallback(() => {
            loadPasswords();
        }, [])
    );

    const togglePasswordVisibility = (index: string) => {
        const updatedPasswords = passwords.map((item, idx) => {
            if (idx == parseInt(index)) item.isVisible = !item.isVisible;
            return item;
        });
        setPasswords([...updatedPasswords]);
    };

    const copyPassword = async (index:string) => {
        try {
            const pass = await getPasswordById(index)
            pass && await Clipboard.setStringAsync(pass.password);
            setInfo('Password copied')
        } catch (error) {
            setError('Something went wrong')
        }
    }

    const renderItem = ({ item, index }: { item: PasswordItem; index: number }) => (
        <View style={styles.passwordItem}>
        <View>
            <Text style={styles.website}>{item.website}</Text>
            <Text style={styles.password}>{item.isVisible ? item.password : '*******'}</Text>
        </View>
        <TouchableOpacity style={styles.clipboardContainer} onPress={()=>copyPassword(`${index}`)}>
            <Ionicons name="clipboard" size={24} />
        </TouchableOpacity>
        <TouchableOpacity   onPress={() => togglePasswordVisibility(`${index}`)}>
            <Ionicons name={item.isVisible ? 'eye-off' : 'eye'} size={24} color={Colors.black} />
        </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {info && <FadingContainer message={info} timeout={5000} errFn={setInfo}/>}
            {error && <FadingContainer message={error} timeout={5000} errFn={setError}/>}

        <FlatList
            data={passwords}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
        />
        <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddPassword')}
        >
            <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
        </View>
    );
};

export default ViewPassword;