
import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, ImageBackground, View, Text } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles, { block_height, turn_block_width, screen_width, card_size } from './css.js';
import EnemyTurn from './EnemyTurn.js';
import { TEST_ANIM } from '../../constants/common.js';

class Turns extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.animation_queue = [];

		this.setEmptyTurns();
	}
	componentDidMount(){
		if(TEST_ANIM){
			
		}
	}
	setEmptyTurns(){
		this.setState({
			turns:[{
				kick:null
			},{
				kick:null,
			},{
				kick:null
			}]
		});
	}
	onAction(action,user,side,slot){
		if(action == 'add_in_slot' && side == 2){
			if(!this.animation_queue.length){
				this.animateAddInSlot(user,slot);
			}

			this.animation_queue.push([user,slot]);
		}else if(action == 'enemy_kick'){
			if(!this.animation_queue.length){
				/**
				 * user - это turn_name
				 * side - это линия цели (1 - герой врага, 2 - бот врага, 3 - свой бот, 4 - свой герой)
				 */
				this.animateKick(user,side,slot);
			}

			this.animation_queue.push([user,side,slot]);
		}
	}
	/**
	 * 
	 * @param {Object} user - конфиг юзера/бота 
	 * @param {Number} slot - номер слота
	 * @param {Number} line - (default 1) - строка, куда будет лететь карта
	 * 	0 - в своего героя
	 * 	1 - в свой слот
	 * 	2 - в чужой слот
	 * 	3 - в чужого героя
	 */
	animateAddInSlot(user,slot,line){
		var rand = Math.floor(Math.random()*this.state.turns.length),
			card = this.refs['card'+rand];

		line = line || 1;

		card.runAnimation(user,slot,line).then(() => {
			BattleActions.event('enemy_added_in_slot',user,slot);
			return card.resetAnimation();
		}).then(() => {
			this.animation_queue.shift();

			let data = this.animation_queue[0];

			if(data && data[2]){
				this.animateKick(data[0],data[1],data[2]);
			}else if(data){
				this.animateAddInSlot(data[0],data[1]);
			}
		});
	}
	animateKick(turn_name,line,slot){
		var rand = Math.floor(Math.random()*this.state.turns.length),
			card = this.refs['card'+rand];

		line = typeof line == 'undefined' ? 1 : line;

		card.runAnimation(turn_name,slot,line).then(() => {
			BattleActions.event('enemy_kicked',turn_name,slot,line);
			return card.resetAnimation();
		}).then(() => {
			this.animation_queue.shift();

			let data = this.animation_queue[0];

			if(data && data[2]){
				this.animateKick(data[0],data[1],data[2]);
			}else if(data){
				this.animateAddInSlot(data[0],data[1]);
			}
		});
	}
	render(){
		return (
			// <TouchableOpacity style={[styles.turn_block,styles.enemy_turn_block]} onPress={() => {
			// 	this.animateAddInSlot(null,4);
			// }}>
			<View style={[styles.turn_block,styles.enemy_turn_block]}>
				{this.state.turns.map((data,index) => {
					const minW = (screen_width - turn_block_width)/2,
						left = minW + index*(card_size.w + card_size.my);

					return (
						<EnemyTurn ref={'card'+index} style={styles.card} key={index} kick={data} container={this} left={left} />
					)
				})}
			{/* </TouchableOpacity> */}
			</View>
    )
  }
}
  
export default Turns;