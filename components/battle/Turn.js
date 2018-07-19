import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, ImageBackground, View } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';

class Turn extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setKick();
	}
	setKick(){
		var kick = this.getKick();

		this.setState({
			kick:kick,
			disabled:this.isDisabled(kick)
		});
	}
	onAction(action,store){
		if(action == 'change' && store.changed.kick != undefined){
			this.setKick();
		}else if(action == 'before_kick'){
			this.setState({
				disabled:true
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
	isDisabled(kick){
		if(!kick) return true;
		if(kick.data.priority == -1) return true;
		if(!Boolean(kick.data.can_kick)) return true;

		return false;
	}
	render(){
		var disabledView;

		if(this.state.disabled){
			disabledView = <View style={{
				width:'100%',
				height:'100%',
				backgroundColor:'rgba(0,0,0,0.5)',
			}}></View>
		}

		return (
			<TouchableOpacity style={{
				flex:1,
				justifyContent:'center',
				alignItems:'center',
				margin:5
			}} onPress={() => {
				if(!this.state.disabled){
					BattleActions.kick(this.state.kick.data.name);
				}
			}}>
				<ImageBackground style={{
					width:'100%',
					height:'100%',
					borderWidth:1,
					borderColor:'#000',
				}} source={C.getImage(this.state.kick.ref.desc.images.active)} resizeMode="contain">
					{disabledView}
				</ImageBackground>
			</TouchableOpacity>
    )
  }
}
  
export default Turn;