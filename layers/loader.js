import React from 'react';
import RefluxComponent from '../engine/views/reflux_component.js';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import C from '../engine/c.js';

const styles = StyleSheet.create({
  full: {
    position:'absolute',
    zIndex:10000,
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  light: {
    position:'absolute',
    zIndex:10000,
    top:0,
    left:0,
    right:0,
    bottom:0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  text:{
    fontSize:32,
    color:'#fff2cd'
  }
});

class Preloader extends RefluxComponent {
  componentWillMount() {
    this.bindStore('lock');
    this.setState(this.store.attributes);
  }
  onAction(action,store){
    if(action == 'change'){
      this.setState(this.store.attributes);
    }
  }
  render() {
    if(this.state.locked){
      if(this.state.full){
        return (
          <ImageBackground style={styles.full} source={C.getImage('ds1/pre_bg.jpg')} resizeMode='center'>
            {/* <Text style={styles.text}>{this.state.text || 'Загрузка...'}</Text> */}
          </ImageBackground>
        )
      }else{
        return (
          <View style={styles.light}>
            <Text style={styles.text}>{this.state.text || 'Загрузка...'}</Text>
          </View>
        )
      }
    }else return null;
  }
}

export default Preloader;