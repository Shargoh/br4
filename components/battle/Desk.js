import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, TouchableOpacity } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import Dims from '../../utils/dimensions.js';

const w = Dims.widthPercent(4);

class Desk extends RefluxComponent {
	componentWillMount(){
		// this.bindStore('Battle');
		// this.setState({
		// 	can_reroll:this.store.get('state').can_reroll
		// });
	}
	render() {
		return (
			<TouchableOpacity style={{
				justifyContent:'center',
				alignItems:'center',
				borderWidth:1,
				borderColor:'#000',
				borderRadius:w,
				position:'absolute',
				bottom:w,
				right:w,
				width:w*3,
				backgroundColor:'yellow'
			}} onPress={() => {
				BattleActions.event('test_enemy_animation');
			}}>
				<Text style={{
					fontSize:24
				}}>+</Text>
			</TouchableOpacity>
    )
  }
}
  
export default Desk;