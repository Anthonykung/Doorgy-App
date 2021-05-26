import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable } from 'react-native';
import { styles } from '../resources/styles';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import Br from '../components/br';

const Stack = createStackNavigator();

export default function Register({ navigation }) {
  const [username, setUsername] = React.useState(true);
  const [password, setPassword] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState(true);

  const doorgyRegister = async () => {
    if (typeof username != "string" || username == "" || typeof password != "string" || password == "") {
      setErrorMsg((curry) => curry = 'Error: Fields Cannot Be Empty');
    }
    else {
      //POST request
      fetch('https://doorgy.anth.dev/api/register', {
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
        // alert(responseJson.status);
        console.log(responseJson);
        if (responseJson.status == 'OK') {
          let data = JSON.stringify({
            username: username,
            password: password
          });
          async (data) => {await SecureStore.setItemAsync('doorgy', data);};
          console.log('Cred saved');
          navigation.navigate('Init');
        }
        else if (responseJson.status == 'This username has been taken') {
          setErrorMsg((curry) => curry = 'This username has been taken, try a different username?');
        }
        else {
          setErrorMsg((curry) => curry = 'Server Error: Unable to create user, try a different username?');
        }
      })
      .catch((error) => {
        alert(error);
        console.error(error);
        setErrorMsg((curry) => curry = 'Server Error: Unable to create user, try a again?');
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../resources/Doorgy-Logo.png')}
        style={{ width: 100, height: 100 }}
      />
      <Text style={{color: '#888', fontSize: 20}}>Doorgy Service</Text>
      <StatusBar style="auto" />
      <Br />
      <Text style={{color: '#888', fontSize: 18}}>Hi There 👋! Welcome, let's get you an account to get started.</Text>
      <Br />
      {typeof errorMsg == "string" && errorMsg != "" && (
        <View>
          <Text style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</Text>
          <Br />
        </View>
      )}
      <TextInput
        onChangeText={setUsername}
        style={styles.textInput}
        placeholder="Username"
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
      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={{color: '#888', fontSize: 18}}
      >
      <Text style={{color: '#888', fontSize: 18}}>Already have an account? Click Me!</Text>
      </Pressable>
    </View>
  );
}
