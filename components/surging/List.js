import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';
import Item from './Item.js';
import C from '../../engine/c.js';

class SurgingList extends RefluxComponent {
	componentWillMount(){
		this.bindService(C.getStore('Surging').get('service'));
		this.updateServiceState();
	}
  render() {
		return (
			<View style={{
				flex:1,
				width:'100%',
			}}>
				<FlatList
					style={{
						marginTop:70
					}}
					data={this.state.surging}
					renderItem={({item}) => (
						<Item item={item} />
					)}
					keyExtractor={(item, index) => 'surging'+index}
				/>
			</View>
    )
  }
}
  
export default SurgingList;