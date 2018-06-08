import React from 'react';
import C from '../../engine/c';
import DateUtils from '../../engine/utils/date';
import GlobalActions from '../../engine/actions';
import { Text, View } from 'react-native';
		
class Timer extends React.Component {
	componentWillMount(){
		var props_time = this.props.time,
			forever = false;

		if(this.props.options){
			this.need_normalize = this.props.options.need_normalize;
			forever = this.props.options.forever;
			delete this.props.options.need_normalize;
		}

		var onTick = function(){
			if (this.props.time != props_time){
				props_time = this.props.time;
				this.setTime();
			}
			
			var time = this.state.time - 1000;
			
			if(time <= 0){
				time = 0;
				if(!forever){
					C.Ticker.off(this.onTick);
				}
				GlobalActions.printEvent('expire',this);
			}

			this.setState({
				time:time
			});
		};
		
		this.onTick = onTick.bind(this);
		
		if(forever){
			C.Ticker.on(this.onTick);
		}
		
		this.setTime();
	}
	componentWillUnmount(){
		C.Ticker.off(this.onTick);
	}
	setTime(){
		var time = DateUtils.getDate(this.props.time);

		if(time.toString().length === 13){
			if(this.need_normalize){
				time = DateUtils.normalizeDate(time);
			}
			time = time - Date.now();
		}else time = time*1000;

		if(time < 0){
			time = 0;
		}else if(!this.props.options || !this.props.options.forever){
			C.Ticker.on(this.onTick);
		}
		
		this.setState({
			time:time
		});
	}
	render(){
		return <Text>{DateUtils.printTime(this.state.time,this.props.options)}</Text>
	}
}

export default Timer;