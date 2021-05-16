import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated, Pressable } from 'react-native';
import { styles } from '../resources/styles';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function Login({ navigation }) {
  const [username, setUsername] = React.useState(true);
  const [password, setPassword] = React.useState(true);

  const doorgyAuth = () => {
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
      <Text style={{color: '#888', fontSize: 18}}>Welcome back 🎉! Miss me? I know I miss you :3</Text>
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
      <Button onPress={doorgyAuth}
      style={styles.button}
      title="Login" />
    </View>
  );
}
