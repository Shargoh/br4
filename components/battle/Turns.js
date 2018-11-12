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
		}else if(action == 'round'){
			if(this.refs.turn0) this.refs.turn0.animatedResetPosition();
			if(this.refs.turn1) this.refs.turn1.animatedResetPosition();
			if(this.refs.turn2) this.refs.turn2.animatedResetPosition();
		}
	}
	render(){
		var reroll_name = C.refs.ref('constants|turn_reroll').value,
			hidden_turns = 0;

		return (
			<View style={[styles.turn_block,styles.my_turn_block]}>
				{this.state.av_kick.map((kick,index) => {
					if(kick.name == reroll_name){
						hidden_turns++;
						return;
					}

					var i = index - hidden_turns,
						style;

					const minW = (screen_width - turn_block_width)/2,
						top = block_height*5,
						left = minW + i*(card_size.w + card_size.my);

					if(i == 1){
						style = {
							marginTop:-card_size.my/2
						}
					}

					return (
						<Turn 
							ref={'turn'+i} 
							style={[styles.turn,style]} 
							index={i} 
							key={i} 
							kick={kick} 
							container={this} 
							top={top} 
							left={left} 
						/>
					)
				})}
			</View>
    )
  }
}
  
export default Turns;