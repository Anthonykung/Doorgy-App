/**
 *
 * @description Doorgy App.
 * @file        App.js
 * @link        https://doorgy.anth.dev
 * @license     Apache-2.0
 * @author      Anthony Kung <hi@anth.dev>
 * @since       1.0.0
 * @version     1.2.0
 *
 */

import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import Login from './views/login';
import Register from './views/register';
import Home from './views/home';
//import Init from './views/init';
import Splash from './views/splash';
import Scheduler from './views/scheduler';
import History from './views/history';

export default function App() {
  const [check, setCheck] = React.useState(false);
  const [user, setUser] = React.useState(true);
  const [initialize, setInitialize] = React.useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen options={{headerShown: false}} name="Register" component={Register} />
        <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
        <Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
        <Stack.Screen options={{headerShown: false}} name="Scheduler" component={Scheduler} />
        <Stack.Screen options={{headerShown: false}} name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
