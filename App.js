import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image, Animated } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function Home({ navigation }) {

  const doorgyAuth = () => {
    //POST request
    fetch('https://doorgy.anth.dev/auth', {
      method: 'POST', //Request Type
      body: JSON.stringify({
        username: 'Anthonykung',
        authToken: 'Te3i6Mjy8~lT3uJenKqI0I&dj1cIe53z%1thZPFn*W'
      }), //post body
      headers: {
        //Header Defination
        'Content-Type':
          'application/x-www-form-urlencoded;charset=UTF-8',
      },
    })
    .then((responseJson) => {
      alert(responseJson);
      console.log(responseJson);
    })
    //If response is not in json then in error
    .catch((error) => {
      alert(error);
      console.error(error);
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./resources/Doorgy-Logo.png')}
        style={{ width: 100, height: 100 }}
      />
      <Text style={{color: '#888', fontSize: 20}}>Doorgy Service</Text>
      <StatusBar style="auto" />
      <br />
      <Text style={{color: '#888', fontSize: 18}}>Login To Proceed</Text>
      <br />
      <TextInput
        style={styles.textInput}
        placeholder="Username"
      />
      <br />
      <TextInput
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2%',
  },
  textInput: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    border: '1px solid #888',
    borderRadius: 4,
    backgroundColor: "#F8F8FF",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "10%",
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    border: '1px solid #888',
    borderRadius: 4,
    backgroundColor: "#FF1493",
    marginHorizontal: "1%",
    marginBottom: 6,
    minWidth: "10%",
    textAlign: "center",
  },
});
