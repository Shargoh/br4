import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import InventoryItem from './InventoryItem.js';
import { InventoryActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import { ACTIVE_SLOT } from '../../constants/common.js';
import Dims from '../../utils/dimensions.js';

const item_side = Dims.itemSide();

const styles = StyleSheet.create({
  button: {
		flex:1,
		width:item_side,
		height:item_side/4,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent:'center'
	},
	text:{
		fontSize:item_side/8,
		color:'#fff',
		flex:1,
		textAlign:'center'
	}
});

class Inventory extends RefluxComponent {
	componentWillMount(){
		this.bindService('inventory');
		this.initSlots();
	}
	onAction(action,store){
		if(action == 'change' && store.changed && store.changed.slots){
			this.initSlots();
		}else if(action == 'change' && store.changed && store.changed.context){
			this.initContext();
		}
	}
	initSlots(){
		var arr = [],
			prepared = this.service.store.get('slots');

		for(let ekey in prepared){
			let slot = prepared[ekey],
				ref = C.refs.ref('slot_type|'+slot.type);

			if(!ref || ref.active == 1) continue;

			slot.items.forEach((item) => {
				var proto = C.refs.ref('item_proto|'+item.proto_id);

				if(!proto) return;

				var item_type = C.refs.ref('item_type|'+proto.type);

				if(!item_type) return;

				if(item_type.slot_on == ACTIVE_SLOT){
					arr.push(item);
				}
			});
		}

		this.setState({
			items:arr
		})
	}
	initContext(){
		var store = this.service.store,
			context = store.get('context');

		if(context && context.item_id){
			this.refs.view.measure((x, y, width, height, pageX, pageY) => {
				context.x -= pageX;
				context.y -= pageY;
	
				this.setState({
					context:context
				});
			});
		}else{
			this.setState({
				context:store.changed.context
			});
		}
	}
  render() {
		var context;

		if(this.state.context && this.state.context.item_id){
			context = (
				<View style={{
					position:'absolute',
					top:this.state.context.y + item_side/3,
					left:this.state.context.x,
					width:item_side,
					height:item_side*2/3
				}}>
					<TouchableOpacity
						style={[styles.button,{
							backgroundColor:'blue'
						}]}
						onPress={() => {
							console.log(1)
						}}
					>
						<Text style={styles.text}>Информация</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button,{
							backgroundColor:'red'
						}]}
						onPress={() => {
							InventoryActions.event('select');
						}}
					>
						<Text style={styles.text}>Использовать</Text>
					</TouchableOpacity>
				</View>
			)
		}

		return (
			<View style={{
				// flex:1,
				borderTopColor:'lime'//нужно оставить - магическим образом добавляет возможность абсолютного позиционирования контекстного меню
			}} ref={'view'}>
				<Text style={{
					fontSize:21,
					textAlign:'center'
				}}>
					Инвентарь
				</Text>
				<FlatList
					horizontal={false}
					numColumns={4}
					data={this.state.items}
					renderItem={({item}) => (
						<InventoryItem item={item} />
					)}
					keyExtractor={(item, index) => 'item'+item.item_id}
				/>
				{context}
			</View>
    )
  }
}
  
export default Inventory;