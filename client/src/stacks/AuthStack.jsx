import React from 'react';
import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Login from '../screens/Login';

const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
      <Tab.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          tabBarLabel: '',
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'grey',
          tabBarStyle: {
            backgroundColor: '#111314',
          },
          headerStyle: {
            backgroundColor: '#ffd002',
          },
          headerTitleStyle: {
            fontWeight: '300',
            fontSize: 25,
            color: 'black',
          }
        }}
      >
          <Tab.Screen
          name={'Login'} 
          component={Login}
          options={{
            tabBarIcon: ({ focused }) => (
            <Feather 
              name={'log-in'}
              size={25}
              color={focused ? 'white' : 'grey' }
            />
            ),
            headerShown: false,
            tabBarHideOnKeyboard: true,
          }}
          />

      </Tab.Navigator>
  )
}

export default AuthStack