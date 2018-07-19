import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, TouchableOpacity } from 'react-native';
import { BattleActions } from '../../engine/actions.js';

class Info extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setState({
			can_reroll:this.store.get('state').can_reroll
		});
	}
	onAction(action,store){
		if(
			(action == 'change' && store.changed.state) ||
			action == 'reroll'
		){
			this.setState({
				can_reroll:store.get('state').can_reroll
			});
		}else if(action == 'before_reroll'){
			this.setState({
				can_reroll:false
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
				backgroundColor:this.state.can_reroll ? 'lime' : 'red',
				margin:5
			}} onPress={() => {
				if(this.state.can_reroll){
					BattleActions.reroll();
				}
			}}>
				<Text style={{
					fontSize:24
				}}>Reroll</Text>
			</TouchableOpacity>
    )
  }
}
  
export default Info;