import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { InventoryActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import Dims from '../../utils/dimensions.js';

const styles = StyleSheet.create({
  item: {
    flex:1,
		justifyContent:'center',
		flexDirection:'row',
		width:Dims.itemSide(),
		height:Dims.itemSide()
	},
	inside: {
		flex:1,
		justifyContent:'center',
	},
	highlighted: {
		transform: [
      { perspective: 850 },
      // { translateX: - Dimensions.get('window').width * 0.24 },
      { rotateY: '60deg'},
    ]
	}
});

class Inventory extends RefluxComponent {
	componentWillMount(){
		this.bindService('inventory');
		this.setState({
			highlighted:false
		});
	}
	onAction(action,index){
		if(action == 'highlight'){
			this.setState({
				highlighted:this.props.index == index
			});
		}else if(action == 'dropped' && this.props.index == index){
			InventoryActions.event('change_item',this.props.slot);
		}
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
			stuff,
			highlighted = this.state.highlighted ? styles.highlighted : undefined;

		if(config){
			stuff = C.getManager('stuff').image(config);
		}

		return (
			<TouchableOpacity style={[styles.item,highlighted]} onPress={() => {
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