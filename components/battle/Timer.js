import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { ImageBackground } from 'react-native';
import Timer from '../common/Timer';
import DateUtils from '../../engine/utils/date.js';
import Dims from '../../utils/dimensions';
import C from '../../engine/c.js';
import { b_timer_bg } from '../../constants/images.js';
import styles from './css';

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
			<ImageBackground style={styles.timer_box} source={C.getImage(b_timer_bg)}>
				<Timer textStyle={styles.timer_text} time={this.state.time} options={{
					type:'short_eng'
				}} />
			</ImageBackground>
    )
  }
}
  
export default BattleTimer;