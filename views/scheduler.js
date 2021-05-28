import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable, TouchableOpacity, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { styles } from '../resources/styles';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import Br from '../components/br';

const Stack = createStackNavigator();

export default function History({ navigation }) {
  const [status, setStatus] = React.useState(true);
  const [config, setConfig] = React.useState({version: -1});
  const [user, setUser] = React.useState({});
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selection, setSelection] = React.useState(true);
  const [temp, setTemp] = React.useState({});
  const [schedule, setSchedule] = React.useState({});

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
          setUser((curry) => curry = data);
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
    <ScrollView contentContainerStyle={[{
      width: '100%',
    }, styles.container]}>
      <Image
        source={require('../resources/Doorgy-Logo.png')}
        style={{ width: 100, height: 100 }}
      />
      <Text style={{color: '#888', fontSize: 20}}>Doorgy Service</Text>
      <Br />
      <Text style={{color: '#888', fontSize: 18}}>Welcome to the scheduler, where all the fun begins 🤓</Text>
      <Text style={{color: '#888', fontSize: 18}}>Click on the schedule to delete. What if you accidentally click it you say? Well, too bad it will be forever lost 🤷</Text>
      <View style={[{
        width: '100%',
        flex: 4,
      }, styles.container]}>
        <View style={[{
          width: '100%',
          flex: 2,
        }, styles.container]}>
          <Picker
            selectedValue={selection}
            style={{ height: '100%', width: '48%' }}
            onValueChange={(itemValue, itemIndex) => setSelection(itemValue)}
          >
            <Picker.Item label="Monday" value="Mon" />
            <Picker.Item label="Tuesday" value="Tue" />
            <Picker.Item label="Wednesday" value="Wed" />
            <Picker.Item label="Thursday" value="Thu" />
            <Picker.Item label="Friday" value="Fri" />
            <Picker.Item label="Saturday" value="Sat" />
            <Picker.Item label="Sun" value="Sun" />
          </Picker>
        </View>
        <Br />
        <View style={[{
          width: '100%',
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 2,
        }, styles.container]}>
          <TextInput
            onChangeText={(text) => {temp.hour = parseInt(text)}}
            style={[styles.textInput, {width: '40%'}]}
            placeholder="Start Hour (0 - 23)"
          />
          <TextInput
            onChangeText={(text) => {temp.minutes = parseInt(text)}}
            style={[styles.textInput, {width: '40%'}]}
            placeholder="Start Minutes (0 - 59)"
          />
          <TextInput
            onChangeText={(text) => {temp.endHour = parseInt(text)}}
            style={[styles.textInput, {width: '40%'}]}
            placeholder="End Hour (0 - 23)"
          />
          <TextInput
            onChangeText={(text) => {temp.endMinutes = parseInt(text)}}
            style={[styles.textInput, {width: '40%'}]}
            placeholder="End Minutes (0 - 23)"
          />
          <Br />
          <Br />
          <TouchableOpacity
            onPress={() => {
              temp.day = selection;
              console.log(temp);
              if (typeof day != true && (temp.hour >= 0 && temp.hour <= 23) && (temp.minutes >= 0 && temp.minutes <= 59) && (temp.endHour >= 0 && temp.endHour <= 23) && (temp.endMinutes >= 0 && temp.endMinutes <= 59)) {
                  if (!config.schedule) {
                    config.schedule = [];
                  }
                  config.schedule.push(temp);
                  setConfig((curry) => curry = config);
                  doorgyUpdate();
              }
              else {
                alert('Ops, looks like something is empty or invalid 🥺');
              }
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
              Add Schedule
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{
        flexDirection: "row",
        flexWrap: "wrap",
        flex: 8,
      }}>
        {config.schedule && config.schedule.reverse().map((value, index, arr) => (
          <TouchableOpacity
            onPress={() => {
              if (index > -1) {
                arr.splice(index, 1);
              }
              doorgyUpdate();
            }}
            style={[
              styles.secondaryButton,
              config.unlock === true && {
                backgroundColor: "deeppink",
              }
            ]}
            key={index}
          >
            <Text
              style={[
                styles.secondaryLabel
              ]}
            >
              Day: {value.day}<Br />
              Start Time: {value.hour + ':' + value.minutes}<Br />
              End Time: {value.endHour + ':' + value.endMinutes}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Br />
      <Button onPress={() => {
        navigation.navigate('Home');
      }}
      style={[styles.button, {flex: 1}]}
      title="Go Back" />
    </ScrollView>
  );
}
