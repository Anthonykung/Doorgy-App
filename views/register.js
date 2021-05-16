import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable } from 'react-native';
import { styles } from '../resources/styles';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function Register({ navigation }) {
  const [username, setUsername] = React.useState(true);
  const [password, setPassword] = React.useState(true);

  const doorgyRegister = () => {
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
      alert(responseJson.status);
      console.log(responseJson);
      if (responseJson.status == 'OK') {
        Keychain
        .setGenericPassword(username, password)
        .then(function() {
          console.log('Credentials saved');
        });
        navigation.navigate('Home');
      }
    })
    .catch((error) => {
      alert(error);
      console.error(error);
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../resources/Doorgy-Logo.png')}
        style={{ width: 100, height: 100 }}
      />
      <Text style={{color: '#888', fontSize: 20}}>Doorgy Service</Text>
      <StatusBar style="auto" />
      <br />
      <Text style={{color: '#888', fontSize: 18}}>Hi There 👋! Welcome, let's get you an account to get started.</Text>
      <br />
      <TextInput
        onChangeText={setUsername}
        style={styles.textInput}
        placeholder="Username"
      />
      <br />
      <TextInput
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.textInput}
        placeholder="Password"
      />
      <br />
      <Button onPress={doorgyRegister}
      style={styles.button}
      title="Register" />
      <br />
      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={{color: '#888', fontSize: 18}}
      >
        <Text style={{color: '#888', fontSize: 18}}>Already have an account? Click Me!</Text>
      </Pressable>
    </View>
  );
}
