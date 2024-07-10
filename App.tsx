import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/ViewPassword/ViewPassword';
import AddPasswordScreen from './screens/AddPassword/AddPasswordScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ViewPasswords">
            <Stack.Screen name="ViewPasswords" component={HomeScreen} />
            <Stack.Screen name="AddPassword" component={AddPasswordScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
