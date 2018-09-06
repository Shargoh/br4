import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import Dims from '../../utils/dimensions.js';

class SpecialDeals extends RefluxComponent {
	componentWillMount(){
		// this.bindService('special_deal');
	}
  render() {
		return (
			<View><Text>Bank</Text></View>
    )
  }
}
  
export default SpecialDeals;