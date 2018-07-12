import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, ImageBackground } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';

class Turn extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setState({
			kick:this.getKick()
		});
	}
	onAction(action,store){
		if(action == 'change' && store.changed.kick != undefined){
			this.setState({
				kick:this.getKick()
			});
		}
	}
	getKick(){
		var data = this.store.get('kick');

		if(!data) return;

		var ref = C.refs.ref('battle_turn|'+data.name);

		return {
			data:data,
			ref:ref
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
				margin:5
			}} onPress={() => {
				if(can_kick){
					BattleActions.kick(name);
				}
			}}>
				<ImageBackground style={{
					width:'100%',
					height:'100%',
					borderRadius:50,
					borderWidth:1,
					borderColor:'#000',
				}} source={C.getImage(this.state.kick.ref.desc.images.active)} resizeMode="contain">
				</ImageBackground>
			</TouchableOpacity>
    )
  }
}
  
export default Turn;