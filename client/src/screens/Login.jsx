import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Image,
  Text,
  TextInput,
  View, 
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
  } from 'react-native';
import Axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ngrokServer } from '../../server/config';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

const Login = () => {
  const [idNum, setIdNum] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.post(`${ngrokServer}/users/login`, { username: idNum, password });
      const userInfo = response.data;
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      AsyncStorage.setItem('userToken', response.data.token);
      AsyncStorage.setItem('sudoMode', JSON.stringify(response.data.sudo));

      const token = await AsyncStorage.getItem('userToken');
      const sudoMode = await AsyncStorage.getItem('sudoMode');

      setIsLoading(false);

      if (token) {
        if (sudoMode === 'true') {
          navigation.navigate("Admin Stack");
        } else if (sudoMode === 'false') {
          navigation.navigate("Main Stack");
        }
      }
    } catch (error) {
      Alert.alert(JSON.stringify(error.response.data.error));
      setIsLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.logo}
          source={require('../../assets/company.jpg')}
        />
        <View>
            <Text style={styles.welcome}>Welcome to Speak-E</Text>
        </View>

        <View style={styles.inputView}>
          <TextInput  
            style={styles.inputText}
            editable
            placeholder="Enter your ID" 
            placeholderTextColor="grey"
            onChangeText={text => setIdNum(text.trim())}
            value={idNum.trim()}
            />
        </View>

        <View style={styles.inputView}>
          <TextInput
            secureTextEntry={true}
            style={styles.inputText}
            editable
            placeholder="Enter your Password" 
            placeholderTextColor="grey"
            onChangeText={text => setPassword(text)}
            value={password}
            />
        </View>

        {!isLoading ?
        (
          <Button title={'Log In'} onPress={onSubmit} />
        ) : 
        (
          <ActivityIndicator size="large" color="#0088cc" />
        )
        }
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffd002',
    alignItems: 'center',  // Center horizontally
    justifyContent: 'flex-start', // Start from the top
    paddingTop: 50,
    // marginTop: StatusBar.currentHeight || 0
  },
  logo: {
    width: 300, // Adjust this width as needed
    height: 200,
    resizeMode: 'center',
  },
  welcome: {
    fontFamily: 'serif',
    color: '#080808',
    fontSize: 20,
    paddingBottom: 20,
  },
  inputView:{
    width:'75%',
    height: '6%',
    backgroundColor:'white',
    padding:20,
    marginBottom:20,
    borderRadius: 6,
    justifyContent:"center",
  },
  inputText:{
    height:50,
    fontSize: 15,
    color:'black'
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

export default Login

