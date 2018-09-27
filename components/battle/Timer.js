import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { View } from 'react-native';
import Timer from '../common/Timer';
import DateUtils from '../../engine/utils/date.js';
import Dims from '../../utils/dimensions';

const w = Dims.widthPercent(4);

class BattleTimer extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setTime();
	}
	onAction(action,store){
		if(
			action == 'change' && 
			store.changed.round
		){
			this.setTime();
		}
	}
	setTime(){
		var state = this.store.get('state'),
			to_round = Number(state.to_round),
			started = DateUtils.normalizeDate(Number(state.start)*1000),
			delta = Date.now() - started;

		to_round -= Math.ceil(delta/1000);

		this.setState({
			time:Number(to_round)
		});
	}
	render() {
		return (
			<View style={{
				justifyContent:'center',
				alignItems:'center',
				borderWidth:1,
				borderColor:'#000',
				borderRadius:w,
				position:'absolute',
				top:w,
				left:w,
				width:w*6,
				backgroundColor:'yellow'
			}}>
				<Timer textStyle={{
					fontSize:24
				}} time={this.state.time} />
			</View>
    )
  }
}
  
export default BattleTimer;