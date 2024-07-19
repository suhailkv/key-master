import React, { useState,useEffect, useCallback, useRef} from 'react';
import { View, Text, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList,PasswordItem } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import Colors from '../../colors';
import FadingContainer from '../../components/FadingCont';
import styles from './styles';
import { deleteAll, getAllPasswords ,getPasswordById,deleteEntry} from '../../libs/passwordManager';
import CONSTANTS from '../../constants';
import { initializeSession } from '../../libs/tokenHandler';
import SwipeCard from '../../components/SwipeComp';
import LoadingScreen from '../../components/Loader';
type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'ViewPasswords'>;
    route: RouteProp<RootStackParamList, 'ViewPasswords'>;
};


const ViewPassword: React.FC<Props> = ({ navigation ,route}) => {
    
    const [passwords, setPasswords] = useState<PasswordItem[]>([]);
    const [info, setInfo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const timeoutRef = useRef<{ [key: string]: NodeJS.Timeout | null }>({});
    const [loading,setIsLoading] = useState(true)
    const loadPasswords = async () => {
            let storedPasswords:PasswordItem[] = (await getAllPasswords()).map(passObj=> {return {...passObj,isVisible:false}});
            setIsLoading(false)
            if (storedPasswords) setPasswords(storedPasswords); 
    };

    useFocusEffect(
        useCallback(() => {
            async function init(){
                try {
                    // deleteAll()
                    if(!(await initializeSession()).result) {setError('Something went wrong');return}
                    loadPasswords();
                    BackHandler.addEventListener('hardwareBackPress', () => {
                        BackHandler.exitApp(); 
                        return true; 
                      });
                } catch (error) {
                    console.log(error);
                    setError('Something went wrong')
                }
            }
            init()
        }, [])
    );

    const togglePasswordVisibility = async (index: string,isUser:boolean = false) => {
      
        if (timeoutRef.current[index]) {
            clearTimeout(timeoutRef.current[index]);
            timeoutRef.current[index] = null;
        }
        const pass = await getPasswordById(index)
        
        pass && setPasswords(passwords=> {
            const stateIndex = passwords.findIndex(entry=> entry.id == index );
            
            if (stateIndex !== -1) {
                const updatedPasswords = [...passwords];
                updatedPasswords[stateIndex] = {
                    ...updatedPasswords[stateIndex],
                    password: !passwords[stateIndex].isVisible ? pass.password : '*******',
                    isVisible: !passwords[stateIndex].isVisible
                };
                isUser && updatedPasswords[stateIndex].isVisible && (timeoutRef.current[index] =setTimeout(()=> updatedPasswords[stateIndex].isVisible && togglePasswordVisibility(index),CONSTANTS.passwordShowTime))
                return updatedPasswords;
            }
            return passwords
        });
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
    const handleSwipeRight = async (id : string|undefined) : Promise<void>=> {
        try {
            if(!id) return
            await deleteEntry(id)
            setPasswords((pass : PasswordItem[])=>{
                return pass.filter((p)=>p.id != id)
            })
            setInfo('Successfully deleted')
        } catch (error) {
            setError('Something went wrong')
        }
    }
    async function handleSwipeLeft (item:PasswordItem)  {
        if(!item.id) return
        navigation.navigate('AddPassword',item)
    }
    const renderItem = ({ item, index }: { item: PasswordItem; index: number }) => {
        return(
        <SwipeCard style={styles.passwordItem} data={item} onSwipeLeft={(pass:PasswordItem)=>handleSwipeLeft(pass)} onSwipeRight={()=>handleSwipeRight(item.id) }>
            <View>
                <Text style={styles.website}>{item.website}</Text>
                <Text style={styles.password}>{item.isVisible ? item.password : '*******'}</Text>
            </View>
            <TouchableOpacity style={styles.clipboardContainer} onPress={() => copyPassword(`${item.id}`)}>
                <Ionicons name="clipboard" size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => togglePasswordVisibility(`${item.id}`, true)}>
                <Ionicons name={item.isVisible ? 'eye-off' : 'eye'} size={24} color={Colors.black} />
            </TouchableOpacity>
        </SwipeCard>
    )};

    return (
        <View style={styles.container}>
            {loading && <LoadingScreen isLoading={setIsLoading} init={false} customMessage={'Loading'} />}
            {info && <FadingContainer message={info} timeout={5000} errFn={setInfo} containerStyle={{backgroundColor:'green'}}/>}
            {error && <FadingContainer message={error} timeout={5000} errFn={setError}/>}
            {!loading && <>
            <FlatList style={{maxHeight:630}} data={passwords} keyExtractor={(_, index) => index.toString()} renderItem={renderItem} />
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPassword')} >
                <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
            </>}
        </View>
    );
};
export default ViewPassword;