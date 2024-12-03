import React, {createContext, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async () => {
    try {
      const response = await Axios.post(`${ngrokServer}/users/login`, { username, password });
      const userInfo = response.data;
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      AsyncStorage.setItem('userToken', response.data.token);
      const userToken = await AsyncStorage.getItem('userToken');
      setUserToken(userToken);
      setIsLoading(false);
    } catch (error) {
      Alert.alert(JSON.stringify(error.response.data.error))
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setIsLoading(false);
      console.log('Logged out');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <AuthContext.Provider value={{login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

const isLoggedIn = async() => {
  try {
    setIsLoading(true);
    let userToken = await AsyncStorage.getItem('userToken');
    setUserToken(userToken);
    setIsLoading(false);
  } catch(e) {
    console.log(`isLoggedIn error: ${e}`)
  }
}

useEffect(() => {
  isLoggedIn();
}, []);