import * as React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../resources/styles';
import 'react-native-gesture-handler';

export default function Br() {
  return (
    <View>
      <Text>{'\n'}</Text>
    </View>
  );
}
