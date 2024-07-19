import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Colors from '../../colors';
import FadingContainer from '../../components/FadingCont'
import {savePassword as savePass,getAllPasswords} from '../../libs/passwordManager'
import {generateStrongPassword} from '../../libs/generateRandomPass'
import styles from './styles';
import { RouteProp } from '@react-navigation/native';
type AddPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddPassword'>;

type Props = {
  navigation: AddPasswordScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'AddPassword'>;

};

const AddPasswordScreen: React.FC<Props> = ({ navigation,route }) => {
  const [website, setWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [ts,setTs] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [editMode,setEditMode] = useState(false)
  
  const editData = route.params;

    useEffect(()=>{
      if(editData !== undefined) {
        
        setEditMode(true)
        setWebsite(editData.website);
        editData.username && setUsername(editData.username)
        editData.id && setTs(editData.id)
      }

    },[editMode])
  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };
  const savePassword = async (id:string | undefined) => {
    if(!_validateEntry()) return
    try {
      await savePass({id,password,website,username})
      await Clipboard.setStringAsync(password);
    } catch (error) {
      console.log(error);
      setError('Something went wrong');
      return
    }
    navigation.goBack();
  };
  const generatePassword  = async () => {
    try {
      setPassword(await generateStrongPassword(16));
    } catch (error) {
      setError('Something went wrong')
    }
  }

  function _validateEntry() {
    if (!website.trim()) {
        setError('Website name cannot be empty.');
        return false;
    }
    if (!password.trim()) {
        setError('Password cannot be empty.');
        return false;
    }
    return true
  }
  return (
    <View style={styles.container}>
         {error && (
        <FadingContainer message={error} timeout={5000} errFn={setError} />
      )}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          placeholder="Enter Website/App name"
          value={website}
          onChangeText={setWebsite}
          style={styles.input}
          placeholderTextColor={Colors.muted}
        />
      </View>
      {/* <TouchableOpacity style={styles.arrowContainer} onPress={toggleAdditionalFields}>
        <Text style={styles.arrow}>{!showAdditionalFields ? '+' : '-'}</Text>
      </TouchableOpacity> */}
      
      {/* {showAdditionalFields && ( */}
         <View style={styles.inputContainer}>
         <Text style={styles.label}>Username</Text>
         <TextInput
           placeholder="Enter username"
           value={username}
           onChangeText={setUsername}
           style={styles.input}
           placeholderTextColor={Colors.muted}
         />
       </View>
      {/* )} */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          style={styles.input}
          placeholderTextColor={Colors.muted}
        />
      </View>
      <TouchableOpacity onPress={()=> setIsPasswordVisible(val=>!val)} style={styles.eyeButton}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={24}
            color="#999"
          />
        </TouchableOpacity>
      <TouchableOpacity style={{...styles.saveButton,marginBottom:10,backgroundColor:'green'}} onPress={generatePassword}>
        <Ionicons name="construct-sharp" size={24} color={Colors.white} />
        <Text style={styles.saveButtonText}>Generate Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={!editMode ? styles.saveButton : {...styles.saveButton,backgroundColor:'orange'}} onPress={()=>{savePassword(editMode ? ts : '')}}>
        <Ionicons name="save-outline" size={24} color={Colors.white} />
        <Text style={styles.saveButtonText}>{editMode ? 'Update':'Save'}</Text>
      </TouchableOpacity>
    </View>
  );
};


export default AddPasswordScreen;
