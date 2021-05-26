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

export default function App() {
  const [check, setCheck] = React.useState(false);
  const [user, setUser] = React.useState(true);
  const [initialize, setInitialize] = React.useState(true);

  useEffect(() => {
    async () => {
      try {
        setInitialize((curry) => curry = false);
        let data = await SecureStore.getItemAsync('doorgy');
        if (data) {
          data = JSON.parse(data);
          console.log('Data: ');
          console.dir(data);
          setUser((curry) => curry = data);
          console.log('User: ');
          console.dir(user);
        }
        else {
          setUser((curry) => curry = null);
        }
      }
      catch (err) {
        console.error('Init failed:', err);
      }
    }
  });

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register"
        screenOptions={{
          headerShown: false
        }}
      >
        {check ? (
          <Stack.Screen options={{headerShown: false}} name="Splash" component={Splash} />
        ) : user == null ? (
          <>
            <Stack.Screen options={{headerShown: false}} name="Register" component={Register} />
            <Stack.Screen options={{headerShown: false}} name="Login" component={Login} />
          </>
        ) /*: user.wifi == null ? (
          <Stack.Screen options={{headerShown: false}} name="Init" component={Init} />
        ) */: (
          <Stack.Screen options={{headerShown: false}} name="Home" component={Home} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
