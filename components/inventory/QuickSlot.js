import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { InventoryActions } from '../../engine/actions.js';
import C from '../../engine/c.js';

const styles = StyleSheet.create({
  item: {
    flex:1,
		justifyContent:'center',
		margin:5,
		width:100,
		height:100
	},
	inside: {
		flex:1,
		justifyContent:'center',
	}
});

class Inventory extends RefluxComponent {
	componentWillMount(){
		this.bindService('inventory');
	}
	compileItem(){
		var slot = this.props.slot;

		if(!slot || !slot.items || !slot.items[0]) return;
		
		return {
			type:'item',
			params:{
				quantity:slot.items.length,
				id:slot.items[0].proto_id
			},
			items_params:slot.items[0]
		};
	}
  render() {
		var config = this.compileItem(),
			stuff;

		if(config){
			stuff = C.getManager('stuff').image(config);
		}

		return (
			<TouchableOpacity style={styles.item} onPress={() => {
				InventoryActions.event('change_item',this.props.slot);
			}}>
				<ImageBackground style={styles.inside} source={C.getImage('ds1/slots/new/empty.jpg')} resizeMode="contain">
					{stuff}
				</ImageBackground>
			</TouchableOpacity>
    )
  }
}
  
export default Inventory;