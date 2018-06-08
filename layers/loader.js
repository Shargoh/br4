import React from 'react';
import RefluxComponent from '../engine/views/reflux_component.js';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position:'absolute',
    zIndex:10000,
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

class Preloader extends RefluxComponent {
  componentWillMount() {
    this.bindStore('lock');
    this.setState(this.store.attributes);
  }
  render() {
    if(this.state.locked){
      return (
        <View style={styles.container}>
          <Text>{this.state.text || 'Loading...'}</Text>
        </View>
      )
    }else return null;
  }
}

export default Preloader;