import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, View } from 'react-native';
import Main from './MainSpecialDeal';
import List from './SpecialDealList';

class SpecialDeals extends RefluxComponent {
	componentWillMount(){
		this.bindService('special_deal');
		this.updateServiceState();
	}
  render(){
		var deals = this.state.special_deal,
			main = deals[0],
			other = deals.slice(1),
			header;

		if(main){
			header = (
				<Text style={{
					fontSize:21,
					color:'lime',
					textAlign:'center'
				}}>
					Специальные предложения
				</Text>
			)
		}

		return (
			<View style={{flex:1}}>
				{header}
				<Main deal={main} />
				<List list={other} />
			</View>
    )
  }
}
  
export default SpecialDeals;