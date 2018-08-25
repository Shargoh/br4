import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import InventoryItem from './InventoryItem.js';
import GlobalActions from '../../engine/actions.js';
import C from '../../engine/c.js';

const TYPE = 14;

class Inventory extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Inventory');
		this.initSlots();
	}
	onAction(action,store){
		if(action == 'change' && store.changed && store.changed.slots){
			this.initSlots();
		}
	}
	initSlots(){
		var arr = [],
			prepared = this.store.get('slots');

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
  render() {
		return (
			<View style={{
				flex:1,
				width:'100%',
				justifyContent:'space-around',
				borderTopWidth:4,
				borderTopColor:'lime',
				flexDirection:'row'
			}}>
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
			</View>
    )
  }
}
  
export default Inventory;