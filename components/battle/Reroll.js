import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import { BattleActions } from '../../engine/actions.js';

class Info extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setState({
			can_reroll:this.store.get('can_reroll')
		});
	}
	onAction(action,store){
		if(action == 'change' && store.changed.state){
			this.setState({
				can_reroll:store.changed.can_reroll
			});
		}
	}
	render() {
		return (
			<TouchableOpacity style={{
				flex:1,
				justifyContent:'center',
				alignItems:'center',
				borderWidth:1,
				borderColor:'#000',
				borderRadius:50,
				margin:5
			}} onPress={() => {
				BattleActions.reroll();
			}}>
				<Text>Reroll</Text>
			</TouchableOpacity>
    )
  }
}
  
export default Info;