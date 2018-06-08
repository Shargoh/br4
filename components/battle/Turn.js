import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions, { BattleActions } from '../../engine/actions.js';

class Turn extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setState({
			kick:this.store.get('kick')
		});
	}
	onAction(action,store){
		if(action == 'change' && store.changed.kick != undefined){
			this.setState({
				kick:store.changed.kick
			});
		}
	}
	render() {
		var name = '-',
			can_kick = false;

		if(this.state.kick){
			name = this.state.kick.name;
			can_kick = true;
		}

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
				if(can_kick){
					BattleActions.kick(name);
				}
			}}>
				<Text>{name}</Text>
			</TouchableOpacity>
    )
  }
}
  
export default Turn;