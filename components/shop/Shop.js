import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import Dims from '../../utils/dimensions.js';
import C from '../../engine/c';

class SpecialDeals extends RefluxComponent {
	componentWillMount(){
		this.bindService(C.getModule('Shop').shop_service);
	}
  render() {
		return (
			<View><Text>Shop</Text></View>
    )
  }
}
  
export default SpecialDeals;