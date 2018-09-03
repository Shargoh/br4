import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, StyleSheet, View, Button, Text } from 'react-native';
import InventoryItem from './InventoryItem.js';
import { InventoryActions } from '../../engine/actions.js';
import C from '../../engine/c.js';

const TYPE = 14;
const styles = StyleSheet.create({
  button: {
    fontSize:10
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

				if(item_type.slot_on == TYPE){
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
					top:this.state.context.y + 100,
					left:this.state.context.x,
					width:100
				}}>
					<Button
						style={styles.button}
						onPress={() => {
							console.log(1)
						}}
						title={'Информация'}
						color={'blue'}
					/>
					<Button
						style={styles.button}
						onPress={() => {
							InventoryActions.event('select');
						}}
						title={'Использовать'}
						color={'red'}
					/>
				</View>
			)
		}

		return (
			<View style={{
				flex:1,
				borderTopColor:'lime'//нужно оставить - магическим образом добавляет возможность абсолютного позиционирования контекстного меню
			}} ref={'view'}>
				<Text style={{
					fontSize:21,
					textAlign:'center'
				}}>
					Инвентарь
				</Text>
				<FlatList
					// style={{
					// 	marginTop:70
					// }}
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