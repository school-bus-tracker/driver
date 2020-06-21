import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import GetStarted from './GetStarted';
import LoginScreen from './LoginScreen';

const RootStack = createStackNavigator();

const RootStackScreen = () => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="GetStarted" component={GetStarted} />
    <RootStack.Screen name="LoginScreen" component={LoginScreen} />
  </RootStack.Navigator>
);

export default RootStackScreen;
