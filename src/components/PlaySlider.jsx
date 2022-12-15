import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default PlaySlider = ({children}) => {

  return (

    <View style={styles.root}>      
      {children}
    </View>

  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#888',
    marginVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    width: '80%'
  }
})
