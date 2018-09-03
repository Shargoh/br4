import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import QuickSlot from './QuickSlot';
import Dims from '../../utils/dimensions';

// тип слота, который рисовать
const TYPE = 14;
const COUNT = 8;

class QuickSlots extends RefluxComponent {
	componentWillMount(){
		this.bindService('inventory');
		this.initSlots();
	}
	onAction(action,store){
		if(action == 'change' && store.changed && store.changed.slots){
			this.initSlots();
		}
	}
	initSlots(){
		var slots = {},
			arr,
			count = 0,
			prepared = this.service.store.get('slots');

		for(let ekey in prepared){
			let slot = prepared[ekey];

			if(count >= COUNT) break;

			if(slot.type == TYPE){
				slots[ekey] = slot;
				count++;
			}
		}

		arr = Object.values(slots);

		if(count < COUNT){
			let i = COUNT - count;

			while(i--){
				arr.push({});
			}
		}

		this.setState({
			slots:slots,
			slots_arr:arr
		})
	}
  render() {
		return (
			<FlatList
				contentContainerStyle={{
					height:Dims.width(2),
					width:'100%',
					zIndex:1
				}}
				horizontal={false}
				numColumns={4}
				data={this.state.slots_arr}
				renderItem={({item,index}) => (
					<QuickSlot slot={item} index={index} />
				)}
				keyExtractor={(slot, index) => 'slot'+(slot.ekey || index)}
			/>
    )
  }
}
  
export default QuickSlots;