import React from 'react';
import { Text, View } from 'react-native';
import { PlaySlider } from '../components';
import { Slider, RangeSlider } from '../atoms';

import styles from './styles'

export default function Home() {

  return (
    <View style={styles.root}>
      <Text>{'Presenta Play slider'}</Text>
      <PlaySlider>
        <Slider />
      </PlaySlider>
    </View>
  );
}
