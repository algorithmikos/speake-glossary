import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator
  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const [cookies, setCookies] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCookies = async () => {
      const cookie = await AsyncStorage.getItem('userToken');
      setCookies(cookie);
    };

    fetchCookies();
  }, []);

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userToken');
      setCookies(null);
      console.log('Logged out');
      navigation.navigate('Auth Stack');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
      {!isLoading ?
        (
          <TouchableOpacity
            style={styles.logout} 
            onPress={() => {logout()}}
          >
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        ) : 
        (
          <ActivityIndicator size="large" color="#FF0000" />
        )
      }
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffd002',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 17
  },
  logout: {
    padding: 10,
    width: 295,
    backgroundColor: 'red',
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
  }
});

export default Logout