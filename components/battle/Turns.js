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
		if(action == 'turns_changed'){
			this.setState({
				av_kick:store.get('state').av_kick
			});
		}
	}
	render(){
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
			</View>
    )
  }
}
  
export default Turns;