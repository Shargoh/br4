import React from 'react';
import C from './engine/c.js';
import CSS from './css/main.js';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import GameApp from './engine/app.js';
import BaseLayer from './layers/base.js';
import LoaderLayer from './layers/loader.js';

C.App = new GameApp().start(['module','lock','service','log']);

export default class App extends React.Component {
  render() {
    return (
      <View style={CSS.container}>
        <StatusBar hidden={true} />
        <BaseLayer />
        <LoaderLayer />
      </View>
    );
  }
}