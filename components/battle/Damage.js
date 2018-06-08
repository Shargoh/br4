import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';

class Damage extends RefluxComponent {
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
	getDamage(){
		var kick = this.state.kick;

		if(!kick) return 'Unavailable';

		if(kick.prognoz.min){
			return kick.prognoz.min + '-' + kick.prognoz.max;
		}else{
			return kick.prognoz.change;
		}
	}
	render() {
		return (
			<View>
				<Text>{this.getDamage()}</Text>
			</View>
    )
  }
}
  
export default Damage;