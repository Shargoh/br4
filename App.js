import React from 'react';
import C from './engine/c.js';
import CSS from './css/main.js';
import { StatusBar, StyleSheet, Text, View, ImageBackground } from 'react-native';
import GameApp from './engine/app.js';
import BaseLayer from './layers/base.js';
import LoaderLayer from './layers/loader.js';
// import AnimatedSprite from 'react-native-animated-sprite';

C.App = new GameApp().start(['module','lock','service','log'/*,'animation'*/]);

export default class App extends React.Component {
  render() {
    var resizeMode = 'center';
    return (
      <ImageBackground style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#110'
      }} source={C.getImage('ds1/battle/result/left.png')} imageStyle={{resizeMode:'stretch'}}>
        <StatusBar hidden={true} />
        <BaseLayer />
        <LoaderLayer />
        {/* <AnimatedSprite 
          ref={'monsterRef'}
          sprite={monsterSprite}
          animationFrameIndex={monsterSprite.animationIndex(this.state.animationType)}
          loopAnimation={false}
          coordinates={{
            top: 100,
            left: 100,
          }}
          size={{
            width: monsterSprite.size.width * 1.65,
            height: monsterSprite.size.height * 1.65,
          }}
          draggable={true}
          tweenOptions = {this.state.tweenOptions}
          tweenStart={'fromMethod'}
          onPress={() => {this.onPress();}}
        /> */}
      </ImageBackground>
    );
  }
}