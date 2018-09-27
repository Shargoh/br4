import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, ImageBackground, View, Text } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles, { block_height, turn_block_width, screen_width, card_size } from './css.js';
import Turn from './Turn.js';

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
				{this.state.av_kick.map((kick,index) => {
					const minW = (screen_width - turn_block_width)/2,
						top = block_height*5,
						left = minW + index*(card_size.w + card_size.my);

					return (
						<Turn style={styles.card} key={index} kick={kick} container={this} top={top} left={left} />
					)
				})}
				{disabledView}
			</View>
    )
  }
}
  
export default Turns;