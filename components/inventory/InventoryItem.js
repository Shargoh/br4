import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Button } from 'react-native';
import { InventoryActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import Dims from '../../utils/dimensions';

const styles = StyleSheet.create({
  item: {
    flex:1,
		justifyContent:'center',
		width:Dims.itemSide(),
		height:Dims.itemSide()
	},
	inside: {
		flex:1,
		justifyContent:'center',
	}
});

class Inventory extends RefluxComponent {
	compileItem(){
		var item = this.props.item;
		
		return {
			type:'item',
			params:{
				quantity:item.param.count || 1,
				id:item.proto_id
			},
			items_params:item
		};
	}
  render() {
		return (
			<TouchableOpacity style={styles.item} ref={'view'} onPress={() => {
				InventoryActions.event('context',this.refs.view,this.props.item)
			}}>
				<ImageBackground style={styles.inside} source={C.getImage('ds1/slots/new/empty.jpg')} resizeMode="contain">
					{C.getManager('stuff').image(this.compileItem())}
				</ImageBackground>
			</TouchableOpacity>
    )
  }
}
  
export default Inventory;