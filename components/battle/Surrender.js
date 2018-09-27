import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, Text } from 'react-native';
import DateUtils from '../../engine/utils/date.js';
import Dims from '../../utils/dimensions.js';
import GlobalActions, { BattleActions } from '../../engine/actions.js';

const w = Dims.widthPercent(4);

class BattleTimer extends RefluxComponent {
	render() {
		return (
			<TouchableOpacity style={{
				justifyContent:'center',
				alignItems:'center',
				borderWidth:1,
				borderColor:'#000',
				borderRadius:w,
				position:'absolute',
				top:w,
				right:w,
				width:w*6,
				backgroundColor:'red'
			}} onPress={() => {
				GlobalActions.log('Surrender!');
			}}>
				<Text style={{
					fontSize:24
				}}>Сдаться</Text>
			</TouchableOpacity>
    )
  }
}
  
export default BattleTimer;