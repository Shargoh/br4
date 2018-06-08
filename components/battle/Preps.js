import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions, { BattleActions } from '../../engine/actions.js';

const cells_count = 4;

class Preps extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setState(this.store.get('state'));
	}
	onAction(action,store){
		if(action == 'change' && store.changed.state){
			this.setState(store.changed.state);
		}
	}
	getEmptyCells(){
		var map = [],
			l = cells_count - this.state.av_prep.length;

		for(let i = 0; i < l; i++){
			map.push({});
		}

		return map;
	}
	render() {
		return (
			<View style={{
				flex:1,
				justifyContent:'space-around',
				flexDirection:'row'
			}}>
				{
					this.state.av_prep.map((item,index) => (
						<TouchableOpacity key={'prep'+item.name} style={{
							flex:1,
							borderWidth:1,
							borderColor:'black',
							justifyContent:'center',
							alignItems:'center',
							margin:5
						}} onPress={() => {
							if(this.state.can_prep){
								BattleActions.prep(item);
							}
						}}>
							<Text>{item.name}</Text>
						</TouchableOpacity>
					))
				}
				{
					this.getEmptyCells().map((item,index) => (
						<View key={'prep'+index} style={{
							flex:1,
							borderWidth:1,
							borderColor:'black',
							margin:5
						}}></View>
					))
				}
			</View>
    )
  }
}
  
export default Preps;