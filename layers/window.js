import React from 'react';
import RefluxComponent from '../engine/views/reflux_component.js';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import C from '../engine/c.js';
import InventoryContainer from '../containers/inventory.js';
import main from '../css/main.js';
import GlobalActions from '../engine/actions.js';

class WindowLayer extends RefluxComponent {
  componentWillMount(){
		this.bindStore('AppStore');
		this.setState(this.store.attributes);
	}
  render() {
    var state = this.state.window,
      cmp;

    if(state == 'inventory'){
      cmp = <InventoryContainer />
    }else return null;

    return (
      <View style={main.window_container}>
        <TouchableOpacity style={main.close_container} onPress={() => {
          GlobalActions.window(null);
        }}>
          <Text style={main.close_btn}>X</Text>
        </TouchableOpacity>
        {cmp}
      </View>
    )
  }
}

export default WindowLayer;