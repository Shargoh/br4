import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { InventoryActions } from '../../engine/actions.js';
import C from '../../engine/c.js';

const styles = StyleSheet.create({
  item: {
    flex:1,
		justifyContent:'center',
		width:100,
		height:100,
		margin:100
	},
	inside: {
		flex:1,
		justifyContent:'center',
	}
});

class ChangeItem extends RefluxComponent {
	componentWillMount(){
		this.bindService('inventory');
		// this.bindService(C.getStore('Surging').get('service'));
		// this.updateServiceState();
	}
	compileItem(){
		var item = this.service.store.get('context').item;
		
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
			<TouchableOpacity style={{
				flex:1,
				flexDirection:'row',
				justifyContent:'center'
			}} onPress={() => {
				InventoryActions.event('unselect')
			}}>
				{/* <TouchableOpacity style={styles.item} ref={'view'} onPress={() => {
					InventoryActions.event('context',this.refs.view,this.props.item)
				}}> */}
					<ImageBackground style={styles.item} source={C.getImage('ds1/slots/new/empty.jpg')} resizeMode="contain">
						{C.getManager('stuff').image(this.compileItem())}
					</ImageBackground>
				{/* </TouchableOpacity> */}
			</TouchableOpacity>
    )
  }
}
  
export default ChangeItem;