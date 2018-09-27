import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, ImageBackground, View, Text } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles from './css.js';

class Turns extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setState({
			av_kick:this.store.get('state').av_kick
		});
	}
	onAction(action,store){
		if(action == 'change' && store.changed.state && store.changed.state.av_kick != undefined){
			this.setState({
				av_kick:store.changed.state.av_kick
			});
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
		if(kick.priority == -1) return true;

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
			<View style={styles.turn_block}>
				{this.state.av_kick.map((kick) => {
					var ref = C.refs.ref('battle_turn|'+kick.name);

					return (
						<TouchableOpacity key={kick.name} style={styles.card} onPress={() => {
							if(!this.isDisabled(kick)){
								BattleActions.kick(kick.name);
							}
						}}>
							<ImageBackground style={styles.card} source={C.getImage(ref.desc.images.active)} resizeMode="contain">
								<Text>123</Text>
							</ImageBackground>
						</TouchableOpacity>
					)
				})}
				{disabledView}
			</View>
    )
  }
}
  
export default Turns;