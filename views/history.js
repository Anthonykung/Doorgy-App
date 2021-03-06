import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../resources/styles';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import Br from '../components/br';

const Stack = createStackNavigator();

export default function History({ navigation }) {
  const [status, setStatus] = React.useState(true);
  const [config, setConfig] = React.useState(false);
  const [user, setUser] = React.useState(false);
  const [history, setHistory] = React.useState(false);

  const doorgyLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('doorgy');
      navigation.navigate('Login', {error: 'Successfully logged out' });
    }
    catch {
      console.log('Unable to reset credentials');
    }
  }

  const doorgyRequest = async () => {
    console.log('Doorgy Request');
    console.log(user);
    //POST request
    fetch('https://doorgy.anth.dev/api/auth', {
      method: 'POST', //Request Type
      body: JSON.stringify({
        username: user.username,
        password: user.password
      }), //post body
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status == 'OK') {
        setConfig((curry) => curry = responseJson);
        console.log('Config updated');
      }
      else {
        console.error('Doorgy Request Error');
        //alert('Error updating config');
      }
    })
    .catch((error) => {
      alert(error);
      console.error(error);
    });
  };

  const doorgyUpdate = async () => {
    //POST request
    fetch('https://doorgy.anth.dev/api/config', {
      method: 'POST', //Request Type
      body: JSON.stringify(config), //post body
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.status == 'OK') {
        console.log('Update success');
        doorgyRequest();
      }
    })
    .catch((error) => {
      alert(error);
      console.error(error);
    });
  };

  useEffect(() => {
    async function init() {
      try {
        let data = await SecureStore.getItemAsync('doorgy');
        if (!data) {
          console.log('Unable to obtain credentials');
          navigation.navigate('Login', {error: 'Unable to obtain credentials, login required' });
        }
        else {
          data = JSON.parse(data);
          setUser((curry) => curry = data);
          if (user.username) {
            doorgyRequest();
          }
          else {
            setStatus((curry) => {curry = false});
          }
        }
      }
      catch (err) {
        console.error('Init failed:', err);
      }
    }
    if (status) {
      setStatus((curry) => {curry = false});
      init();
    }
    if (!config.username || !config.history) {
      doorgyRequest();
    }
    if (config.history && Array.isArray(config.history)) {
      console.log('Config.History:', config.history);
      setHistory((curry) => {curry = config.history});
    }
    if (history) {
      console.log('Curry.History', history);
      setHistory((curry) => {curry = curry.reverse()});
    }
  });

  return (
    <View style={styles.container}>
      <Image
        source={require('../resources/Doorgy-Logo.png')}
        style={{ width: 100, height: 100 }}
      />   
      <Text style={{color: '#888', fontSize: 20}}>Doorgy Service</Text>
      <StatusBar style="auto" />
      <Br />
      <Text style={{color: '#888', fontSize: 18}}>Here's everything that has happened ????</Text>
      <Br />
      <ScrollView style={{
        width: '100%',
        height: '80%'
      }}>
        {Array.isArray(config.history) ? (config.history.sort().map((value, index, arr) => {
          let curryTime = new Date(value.time);
          return (
            <Text key={index} style={[styles.secondaryButton, (value.event == 'open') && {backgroundColor: '#Df9388'}, (value.event == 'close') && {backgroundColor: '#a9df88'}, (value.event == 'lock') && {backgroundColor: '#88d4df'}, (value.event == 'unlock') && {backgroundColor: '#be88df'}]}>
              Event: {value.event}{'\n'}
              Time: {curryTime.getFullYear()}{'-'}{curryTime.getMonth()}{'-'}{curryTime.getDate()}{' '}{curryTime.getHours()}{':'}{curryTime.getMinutes()}
            </Text>
          )
        })) : <Text>oops I seem to have forgotten your history :O or I'm just loading ????</Text>}
      </ScrollView>
      <Br />
      <Button onPress={() => {
        navigation.navigate('Home');
      }}
      style={[styles.button, {flex: 2}]}
      title="Go Back" />
    </View>
  );
}
