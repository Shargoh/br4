import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import Dims from '../../utils/dimensions.js';
import C from '../../engine/c';
import List from './ShopList';

class Shop extends RefluxComponent {
	constructor(props){
		super(props);

		this.state = {
			items:[]
		};
	}
	componentWillMount(){
		this.bindService(C.getModule('Shop').shop_service);
		this.updateServiceState();
	}
	onAction(action,store){
		if(action == 'update_view'){
			this.updateServiceState();
		}
	}
  render() {
		return (
			<View style={{flex:1}}>
				<Text style={{
					fontSize:21,
					color:'lime',
					textAlign:'center'
				}}>
					Магазин
				</Text>
				<List list={this.state.items} />
			</View>
    )
  }
}
  
export default Shop;