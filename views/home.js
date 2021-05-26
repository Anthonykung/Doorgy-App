import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable, TouchableOpacity } from 'react-native';
import { styles } from '../resources/styles';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import Br from '../components/br';

const Stack = createStackNavigator();

export default function Home({ navigation }) {
  const [user, setUser] = React.useState(true);
  const [newUser, setNewUser] = React.useState(true);
  const [initialize, setInitialize] = React.useState(true);
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
    fetch('https://doorgy.anth.dev/api/opt', {
      method: 'POST', //Request Type
      body: JSON.stringify({
        username: username,
        password: password
      }), //post body
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      setConfig((curry) => curry = responseJson);
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
        navigation.navigate('Home');
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
        setInitialize((curry) => curry = false);
        let data = await SecureStore.getItemAsync('doorgy');
        if (!data) {
          console.log('Unable to obtain credentials');
          //navigation.navigate('Login', {error: 'Unable to obtain credentials, login required' });
        }
        data = JSON.parse(data);
        console.log('Data: ');
        console.dir(data);
        setUser((curry) => curry = data);
        console.log('User: ');
        console.dir(user);
        if (user.wifi) {
          setNewUser((curry) => curry = false);
        }
        else {
          setNewUser((curry) => curry = true);
        }
      }
      catch (err) {
        console.error('Init failed:', err);
      }
    }
    console.log('Track Status:', initialize);
    if (initialize && initialize != false) {
      init();
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
      <Text style={{color: '#888', fontSize: 18}}>Hi {user.username} 👋! How can I help?</Text>
      <Br />
      <View style={{
        flexDirection: "row",
        flexWrap: "wrap",
      }}>
      <TouchableOpacity
        onPress={() => alert('Connection failure')/*() => setSelectedValue(value)*/}
        style={[
          {
            paddingHorizontal: 8,
            paddingVertical: 20,
            borderRadius: 4,
            backgroundColor: "coral",
            alignSelf: "center",
            marginHorizontal: "1%",
            marginBottom: 6,
            minWidth: "48%",
            textAlign: "center",
          }
        ]}
      >
        <Text
          style={[
            styles.buttonLabel
          ]}
        >
          Unlock
        </Text>
      </TouchableOpacity>
      <Br />
      <TouchableOpacity
        onPress={() => alert('Connection failure')/*() => setSelectedValue(value)*/}
        style={[
          {
            paddingHorizontal: 8,
            paddingVertical: 20,
            borderRadius: 4,
            backgroundColor: "coral",
            alignSelf: "center",
            marginHorizontal: "1%",
            marginBottom: 6,
            minWidth: "48%",
            textAlign: "center",
          }
        ]}
      >
        <Text
          style={[
            styles.buttonLabel
          ]}
        >
          Open
        </Text>
      </TouchableOpacity>
      </View>
      <Br />
      <Button onPress={doorgyLogout}
      style={styles.button}
      title="Logout" />
    </View>
  );
}
