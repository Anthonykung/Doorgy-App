import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View, TextInput, Image } from 'react-native';

export default function App() {
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
        style={styles.textInput}
        placeholder="Password"
      />
      <br />
      <Button onPress={() => {
        alert('This app is still under development');
      }}
      style={styles.button}
      title="Login" />
    </View>
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
