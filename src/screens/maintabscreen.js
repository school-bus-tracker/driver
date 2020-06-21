import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import config from '../config/deviceconfig';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './home';
import Alerts from './alerts';
import Profile from './profile';
import Settings from './settings';
import {Attendance} from './attendance';

//Bottom Tab Navigators
const Tab = createMaterialBottomTabNavigator();

export const MainTabScreen = navigation => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#ffffff"
      inactiveColor="#7e807f"
      barStyle={{backgroundColor: '#000000'}}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused, color}) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="attendance"
        component={Attendance}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="note-multiple-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={Alerts}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="bell-outline"
              color={color}
              size={26}
            />
          ),
          tabBarBadge: 5,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

//Stack Navigator
const profileStack = createStackNavigator();
const ProfileStackScreen = ({navigation}) => {
  return (
    <profileStack.Navigator>
      <profileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          headerRight: () => (
            <MaterialCommunityIcons
              style={{paddingRight: config.deviceWidth * 0.05}}
              name="settings"
              size={28}
              onPress={() => navigation.navigate('Settings')}
            />
          ),
        }}
      />
      <profileStack.Screen name="Settings" component={Settings} />
    </profileStack.Navigator>
  );
};
