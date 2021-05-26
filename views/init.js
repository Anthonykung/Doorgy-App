import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable, TouchableOpacity } from 'react-native';
import { styles } from '../resources/styles';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import Br from '../components/br';
import { BleManager } from 'react-native-ble-plx';

const Stack = createStackNavigator();

class Init2 extends React.Component {
  constructor() {
    super();
    this.state = {
      config: {}
    };
    this.manager = new BleManager();
    async function construct() {
      let data = await SecureStore.getItemAsync('doorgy');
      if (!data) {
        console.log('Unable to obtain credentials');
        navigation.navigate('Login', {error: 'Unable to obtain credentials, login required' });
      }
      data = JSON.parse(data);
      config = data;
    }
    construct();
  }
  
  scanAndConnect = () => {
    this.manager.startDeviceScan(null, null, (err, device) => {
      if (err) {
        console.error('Bluetooth Error:', err);
        return;
      }

      // Check for doorgy service
      if (device.name === 'Doorgy Service' || device.name === 'Doorgy') {
        
        // If Doorgy found, stop scanning
        this.manager.stopDeviceScan();

        // Initiate connection
        device.connect()
        .then((device) => {
          // Connection established, get service
          return device.discoverAllServicesAndCharacteristics();
        })
        .then((device) => {
          // Do work on device with services and characteristics
          return this.manager.writeCharacteristicWithoutResponseForDevice(device.id, 'ade0', 'ade1', Buffer.from(JSON.stringify(this.state.config)).toString('base64'));
        })
        .catch((err) => {
          console.error('Bluetooth Error:', err);
        });
      }
      else {
        alert(':C Doorgy Service Not Found, is the blue LED on?');
      }
    });
  }

  doorgyUpdate = async () => {
    this.scanAndConnect();
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
        async function updateUser(user) {
          await SecureStore.setItemAsync('doorgy', JSON.stringify(user));
        }
        updateUser(user);
        navigation.navigate('Home');
      }
    })
    .catch((error) => {
      alert(error);
      console.error(error);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../resources/Doorgy-Logo.png')}
          style={{ width: 100, height: 100 }}
        />
        <Text style={{color: '#888', fontSize: 20}}>Doorgy Service</Text>
        <StatusBar style="auto" />
        <Br />
        <Text style={{color: '#888', fontSize: 18}}>Welcome {user.username} 👋! I'll just need a few things from you to get started.</Text>
        <Br />
        {typeof errorMsg == "string" && errorMsg != "" && (
          <View>
            <Text style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</Text>
            <Br />
          </View>
        )}
        <Text style={{color: '#888', fontSize: 18}}>WiFi Info</Text>
        <Br />
        <TextInput
          onChangeText={(text) => {
            this.state.config.country = text;
          }}
          style={styles.textInput}
          placeholder="Country"
        />
        <Br />
        <TextInput
          onChangeText={(text) => {
            this.state.config.ssid = text;
          }}
          style={styles.textInput}
          placeholder="WiFi SSID"
        />
        <Br />
        <TextInput
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Password"
        />
        <Br />
        <TextInput
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="Password"
        />
        <Br />
        <Button onPress={doorgyUpdate}
        style={styles.button}
        title="Save Configuration" />
        <Br />
      </View>
    );
  }
}

export default function Init({ navigation }) {
  const [user, setUser] = React.useState(true);
  const [config, setConfig] = React.useState(true);

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

  

  useEffect(() => {
    async function init() {
      let data = await SecureStore.getItemAsync('doorgy');
      if (!data) {
        console.log('Unable to obtain credentials');
        navigation.navigate('Login', {error: 'Unable to obtain credentials, login required' });
      }
      data = JSON.parse(data);
      setUser((curry) => curry = data);
      this.manager = new BleManager();
    }
    init();
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
      <Text style={{color: '#888', fontSize: 18}}>Welcome {user.username} 👋! I'll just need a few things from you to get started.</Text>
      <Br />
      {typeof errorMsg == "string" && errorMsg != "" && (
        <View>
          <Text style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</Text>
          <Br />
        </View>
      )}
      <Text style={{color: '#888', fontSize: 18}}>WiFi Info</Text>
      <Br />
      <TextInput
        onChangeText={setUsername}
        style={styles.textInput}
        placeholder="WiFi SSID"
      />
      <Br />
      <TextInput
        onChangeText={setUsername}
        style={styles.textInput}
        placeholder="WiFi SSID"
      />
      <Br />
      <TextInput
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.textInput}
        placeholder="Password"
      />
      <Br />
      <Button onPress={doorgyRegister}
      style={styles.button}
      title="Register" />
      <Br />
    </View>
  );
}
