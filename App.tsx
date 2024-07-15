import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/ViewPassword/ViewPassword';
import Authentication from './screens/HomeScreen/HomeScreen';
import AddPasswordScreen from './screens/AddPassword/AddPasswordScreen';
import { RootStackParamList } from './types';
import { View,StyleSheet ,Text,Button, TouchableOpacity} from 'react-native';
import styles2 from './screens/AddPassword/styles';
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Authentication">
            <Stack.Screen name="Authentication" component={Authentication} options={{ headerShown: false }}/>
            <Stack.Screen name="ViewPasswords" component={HomeScreen}  options={({ navigation }) => ({
            headerLeft: () => (
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Key Master</Text>
              </View>
            ),
            headerRight: () => (
                <>
              
              <TouchableOpacity style={{...styles2.saveButton,backgroundColor:'red'}} onPress={() => {
                  navigation.navigate('Authentication');
                }}>
        <Text style={styles2.saveButtonText}>Logout</Text>
      </TouchableOpacity>
                </>
            ),
            headerTitle: '',
            headerStyle: styles.headerStyle,
          })}/>
            <Stack.Screen name="AddPassword" component={AddPasswordScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
const styles = StyleSheet.create({
    headerLeft: {
      marginLeft: 10,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    headerStyle: {
      backgroundColor: '#f8f8f8',
    },
  });
