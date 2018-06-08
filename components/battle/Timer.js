import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';
import Timer from '../common/Timer';
import DateUtils from '../../engine/utils/date.js';

class BattleTimer extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setTime();
	}
	onAction(action,store){
		if(
			action == 'change' && 
			store.changed.state &&
			(
				store.changed.state.start != store.previous.state.start ||
				store.changed.state.to_round != store.previous.state.to_round
			)
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
				flex:1,
				justifyContent:'center',
				alignItems:'center',
				borderWidth:1,
				borderColor:'#000',
				borderRadius:50,
				margin:5
			}}>
				<Timer time={this.state.time} />
			</View>
    )
  }
}
  
export default BattleTimer;