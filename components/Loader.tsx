import React,{useEffect, useState} from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text } from 'react-native';
import { checkDeviceSecurity } from '../libs/securityCheck';
import FadingContainer from './FadingCont';
interface LoadingScreenProps {
    isLoading: Function;
}
const LoadingScreen: React.FC<LoadingScreenProps> = ({isLoading}) => {
    const [error,setError] = useState<string>('')
    useEffect(()=> {
        async function checkSecurity(){
            try {
                await checkDeviceSecurity()
                setTimeout(()=>isLoading(false),1000)
            } catch (error) {
                setError('Something went wrong.Restart Application')                
            }
        }
        checkSecurity()
    },[])
    return (
        
        <View style={styles.container}>
            {error && <FadingContainer message={error} timeout={4000} errFn={setError}/>}
            <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="contain" />
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Checking device security...</Text> 
        </View>
    );
};
const styles = StyleSheet.create({
    loadingText: {
        marginTop: 10, 
        fontSize: 16,
        color: '#333',
      },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', 
    },
    logo: {
        width: 200, 
        height: 200, 
        marginBottom: 20,
    },
});

export default LoadingScreen;
