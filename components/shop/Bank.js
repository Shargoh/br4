import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import Dims from '../../utils/dimensions.js';
import C from '../../engine/c';
import List from './BankList';

class Shop extends RefluxComponent {
	constructor(props){
		super(props);

		this.state = {
			payment_preset:[]
		};
	}
	componentWillMount(){
		this.bindService('payment');
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
					Банк
				</Text>
				<List list={this.state.payment_preset} />
			</View>
    )
  }
}
  
export default Shop;