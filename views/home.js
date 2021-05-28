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
  const [status, setStatus] = React.useState(true);
  const [config, setConfig] = React.useState(true);
  const [user, setUser] = React.useState(true);

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
    console.log('Doorgy Update');
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
      <Text style={{color: '#888', fontSize: 18}}>Hi {config.username} 👋! How can I help?</Text>
      <Br />
      <Text style={{color: '#888', fontSize: 18}}>You have made {config.version} commands to Doorgy 🤯</Text>
      <Br />
      <View style={{
        flexDirection: "row",
        flexWrap: "wrap",
      }}>
        {/* Unlock Command*/}
        <TouchableOpacity
          onPress={() => {
            if (config.unlock == false) {
              config.unlock = true;
            }
            else {
              config.unlock = false;
            }
            doorgyUpdate();
          }}
          style={[
            styles.secondaryButton,
            config.unlock === true && {
              backgroundColor: "deeppink",
            }
          ]}
        >
          <Text
            style={[
              styles.secondaryLabel
            ]}
          >
            Unlock
          </Text>
        </TouchableOpacity>
        {/* Open Command*/}
        <TouchableOpacity
          onPress={() => {
            if (config.open == false) {
              config.open = true;
            }
            else {
              config.open = false;
            }
            doorgyUpdate();
          }}
          style={[
            styles.secondaryButton,
            config.open === true && {
              backgroundColor: "deeppink",
            }
          ]}
        >
          <Text
            style={[
              styles.secondaryLabel
            ]}
          >
            Open
          </Text>
        </TouchableOpacity>
        {/* Schedule */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Scheduler');
          }}
          style={[
            styles.secondaryButton
          ]}
        >
          <Text
            style={[
              styles.secondaryLabel
            ]}
          >
            Scheduler
          </Text>
        </TouchableOpacity>
        {/* History */}
        <TouchableOpacity
          onPress={() => {
            if (config.history) {
              navigation.navigate('History');
            }
            else {
              alert('Uh oh, it doesn\'t look like you have any history 😱');
            }
          }}
          style={[
            styles.secondaryButton
          ]}
        >
          <Text
            style={[
              styles.secondaryLabel
            ]}
          >
            History
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
