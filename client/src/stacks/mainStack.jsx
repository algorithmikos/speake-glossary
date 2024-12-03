import React from 'react';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MyWords from '../screens/MyWords';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainStack = () => {
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
          name={'📝 My Words'} 
          component={MyWords}
          options={{
            tabBarIcon: ({ focused }) => (
            <Feather 
              name={'book-open'}
              size={25}
              color={focused ? 'white' : 'grey' }
            />
            ),
            headerShown: false,
          }}
          />

        <Tab.Screen
          name={'Settings'} 
          component={Settings}
          options={{
            tabBarIcon: ({ focused }) => (
            <Feather 
              name={'settings'}
              size={25}
              color={focused ? 'white' : 'grey' }
            />
            ),
            headerShown: false,
          }}
          />
      </Tab.Navigator>
  )
}

export default MainStack