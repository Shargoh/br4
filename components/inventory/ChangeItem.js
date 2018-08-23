import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';
import C from '../../engine/c.js';

class ChangeItem extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Inventory');
		// this.bindService(C.getStore('Surging').get('service'));
		// this.updateServiceState();
	}
  render() {
		return (
			<View style={{
				flex:1,
				width:'100%',
			}}>
				<Text>ChangeItem</Text>
			</View>
    )
  }
}
  
export default ChangeItem;