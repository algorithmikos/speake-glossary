import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

import AuthStack from './src/stacks/AuthStack';
import MainStack from './src/stacks/mainStack';
import AdminStack from './src/stacks/adminStack';

const Stack = createNativeStackNavigator();

const App = () => {
  const [cookies, setCookies] = useState(null);
  const [isSudo, setIsSudo] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      const sudoMode = await AsyncStorage.getItem('sudoMode');
      setCookies(userToken);
      setIsSudo(sudoMode);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0088cc" />
      </View>
    );
  }

  let initialRoute = 'Auth Stack';
  if (cookies !== null) {
    initialRoute = isSudo === 'true' ? 'Admin Stack' : 'Main Stack';
  }

  return (
    <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth Stack" component={AuthStack} />
          <Stack.Screen name="Main Stack" component={MainStack} />
          <Stack.Screen name="Admin Stack" component={AdminStack} />
        </Stack.Navigator>
        < Toast />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
