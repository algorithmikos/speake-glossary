import React from 'react';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddWord from '../screens/AddWord';
import CreateUser from '../screens/CreateUser';
import WordToUser from '../screens/WordToUser';
import WordsView from '../screens/WordsView';
import Users from '../screens/Users';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AdminStack = () => {
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
          name="Assign Word(s) to Student(s)"
          component={WordToUser}
          options={{
            tabBarIcon: ({ focused }) => (
            <Feather 
              name={'clipboard'}
              size={25}
              color={focused ? 'white' : 'grey' }
            />
            ),
            headerShown: false,
            tabBarHideOnKeyboard: true,
          }}
          />

          <Tab.Screen 
          name={'Add a New Word'} 
          component={AddWord}
          options={{
            tabBarIcon: ({ focused }) => (
            <Feather 
              name={'edit'}
              size={25}
              color={focused ? 'white' : 'grey' }
            />
            ),
            tabBarHideOnKeyboard: true,
          }}
          />

          <Tab.Screen 
            name={'Create Account(s)'} 
            component={CreateUser}
            options={{
              tabBarIcon: ({ focused }) => (
              <Feather 
                name={'user-plus'}
                size={25}
                color={focused ? 'white' : 'grey' }
              />
              ),
              tabBarHideOnKeyboard: true,
            }}
          />

          <Tab.Screen 
          name={'Students'}
          component={Users}
          options={{
            tabBarIcon: ({ focused }) => (
            <Feather 
              name={'users'}
              size={25}
              color={focused ? 'white' : 'grey' }
            />
            ),
            tabBarHideOnKeyboard: true,
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
              )
            }}
          />
      </Tab.Navigator>
  )
}

export default AdminStack