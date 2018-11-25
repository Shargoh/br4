import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, ImageBackground, View, Text } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles, { block_height, turn_block_width, screen_width, card_size, battle_height } from './css.js';
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

					var top = battle_height - block_height,
						style = {
							position:'absolute',
							zIndex:100
						};

					const minW = (screen_width - turn_block_width)/2,
						i = index - hidden_turns,
						w = card_size.w,
						k = 1/3.5;

					if(i == 0){
						style.left = turn_block_width/2 - w*1.5 + w*k;
						style.zIndex += 2;
					}else if(i == 1){
						style.left = turn_block_width/2 - w/2;
						style.top = -card_size.h/24;
						top += style.top;
						style.zIndex += 1;
					}else if(i == 2){
						style.left = turn_block_width/2 + w/2 - w*k;
					}

					return (
						<Turn 
							ref={'turn'+i} 
							style={[styles.my_turn,style]} 
							index={i} 
							key={i} 
							kick={kick} 
							container={this} 
							margin_top = {style.top || 0} //нужно чтобы правильно анимировать
							top={top} // вроде не нужно
							left={style.left + minW} 
						/>
					)
				})}
			</View>
    )
  }
}
  
export default Turns;