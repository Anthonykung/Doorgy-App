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
  const [config, setConfig] = React.useState(true);

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
    //POST request
    fetch('https://doorgy.anth.dev/api/auth', {
      method: 'POST', //Request Type
      body: JSON.stringify({
        username: config.username,
        password: config.password
      }), //post body
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.version > config.version) {
        setConfig((curry) => curry = responseJson);
        console.log('Config updated');
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
          doorgyRequest();
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
    if (!config.username) {
      doorgyRequest();
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
      <Text style={{color: '#888', fontSize: 18}}>Here's everything that has happened 😉</Text>
      <Br />
      <ScrollView style={{
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 8
      }}>
        {config.history.reverse().map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => setSelectedValue(value)}
            style={[styles.button, selectedValue === value && styles.selected]}
          >
            <Text
              style={[
                styles.buttonLabel,
                selectedValue === value && styles.selectedLabel,
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
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
