import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, View } from 'react-native';
import GlobalActions, { BattleActions } from '../../engine/actions.js';

class Turn extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		// this.setState({
		// 	kick:this.store.get('kick')
		// });
	}
	onAction(action,store){
		// if(action == 'change' && store.changed.kick != undefined){
		// 	this.setState({
		// 		kick:store.changed.kick
		// 	});
		// }
	}
	render() {
		// return (
		// 	<View style={{
		// 		position:'absolute',
		// 		left:0,
		// 		right:0,
		// 		top:0,
		// 		bottom:0,
		// 	}}>
		// 		<Text>ANIMATION!</Text>
		// 	</View>
		// )
		return null;
  }
}
  
export default Turn;