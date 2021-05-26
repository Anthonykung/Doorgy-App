import React from 'react';
import { Text, View, Image } from 'react-native';
import { styles } from '../resources/styles';
import 'react-native-gesture-handler';

export default function Splash({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../resources/Doorgy-Logo.png')}
        style={{ width: 100, height: 100 }}
      />
      <Text style={{color: '#888', fontSize: 20}}>Loading Doorgy Service</Text>
    </View>
  );
}
