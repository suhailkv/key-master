import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../colors';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

type PasswordItem = {
  website: string;
  password: string;
  isVisible: boolean;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);

  const loadPasswords = async () => {
    const storedPasswords = await AsyncStorage.getItem('passwords');
    if (storedPasswords) {
      setPasswords(JSON.parse(storedPasswords));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPasswords();
    }, [])
  );

  const togglePasswordVisibility = (index: number) => {
    const updatedPasswords = passwords.map((item, idx) => {
      if (idx === index) {
        item.isVisible = !item.isVisible;
      }
      return item;
    });
    setPasswords([...updatedPasswords]);
  };

  const renderItem = ({ item, index }: { item: PasswordItem; index: number }) => (
    <View style={styles.passwordItem}>
      <View>
        <Text style={styles.website}>{item.website}</Text>
        <Text style={styles.password}>{item.isVisible ? item.password : '*******'}</Text>
      </View>
      <TouchableOpacity onPress={() => togglePasswordVisibility(index)}>
        <Ionicons name={item.isVisible ? 'eye-off' : 'eye'} size={24} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light,
  },
  passwordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: Colors.white,
    borderRadius: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  website: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  password: {
    fontSize: 14,
    color: Colors.dark,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default HomeScreen;
