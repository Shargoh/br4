/**
 * Компонент бота в слоте
 * props:
 * 	store
 * 	slot_id
 * 	enemy
 */
import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import styles, { block_height, card_size } from './css';
import { BattleActions } from '../../engine/actions.js';

const W = card_size.w + card_size.my,
	DK1 = 500, // время полета на цель
	DK2 = 500, // время полета назад
	D1 = 500, // время на исчезновение
	D2 = 200; // время на появление

class Bot extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');

		this.setState({
			animated:{
				top:new Animated.Value(0),
				left:new Animated.Value(0),
				opacity:new Animated.Value(1)
			}
		});

		if(this.props.enemy){
			this.animateAddInSlot = this.animateEnemyAddInSlot;
		}else{
			this.animateAddInSlot = this.animateFriendlyAddInSlot;
		}
	}
	animateEnemyAddInSlot(user,slot){
		Animated.timing(this.state.animated.opacity,{
			toValue:1,
			duration:D2
		}).start();
	}
	animateFriendlyAddInSlot(user,slot){
		Animated.timing(this.state.animated.opacity,{
			toValue:1,
			duration:D2
		}).start();
	}
	animateRemoveFromSlot(slot){
		Animated.timing(this.state.animated.opacity,{
			toValue:0,
			duration:D1
		}).start();
	}
	/**
	 * 
	 * @param {Object} data 
	 * 	@param {Array} u [side,title,ekey,?,?]
	 * 	@param {Array} u1
	 * 	@param {Array} u2
	 * 	@param {String} turn_name
	 * 	@param {String} result - hit|krit
	 */
	animateKick(data,slot,resolve){
		// на всякий пожарный, вдруг после F5 придут данные до отрисовки
		if(!this.state) return;

		// временно не обрабатываю если нет цели. Потом будет анимация в зависимости от удара
		if(!data.u2) return;

		var enemy_slots = this.store.get('slots').slots[data.u2[0]],
			user = this.store.getUser(),
			enemy = this.store.getEnemy(),
			enemy_slot,
			enemy_line;

		if(data.u2[2] == user.battle.ekey){
			enemy_line = 3;
			enemy_slot = 3;
		}else if(enemy && data.u2[2] == enemy.battle.ekey){
			enemy_line = 0;
			enemy_slot = 3;
		}else{
			for(let slot_id in enemy_slots){
				if(enemy_slots[slot_id] == data.u2[2]){
					enemy_slot = Number(slot_id);
					enemy_line = Number(data.u2[0]) == 1 ? 2 : 1;
				}
			}
		}

		this.runAnimation(data.turn_name,slot,enemy_slot,enemy_line,data.u2[2]).then(resolve);
	}
	runAnimation(turn_name,slot,enemy_slot,enemy_line,enemy_ekey){
		var line = this.props.enemy ? 1 : 2,
			dl = enemy_line - line,
			ds = enemy_slot - slot;

		return new Promise((resolve,reject) => {
			Animated.sequence([
				Animated.parallel([
					Animated.timing(this.state.animated.left,{
						toValue:W*ds,
						duration:DK1
					}),
					Animated.timing(this.state.animated.top,{
						toValue:block_height*dl/2,
						duration:DK1
					})
				]),
				Animated.parallel([
					Animated.timing(this.state.animated.left,{
						toValue:0,
						duration:DK2
					}),
					Animated.timing(this.state.animated.top,{
						toValue:0,
						duration:DK2
					})
				])
			]).start(resolve);
	
			setTimeout(() => {
				BattleActions.event('apply_slot_changes',enemy_ekey);
			},DK1);
		});
	}
	render() {
		var store = this.props.store,
			shape = store.getShape('thumb');

		return (
			<Animated.View style={[styles.card,{
				top:this.state.animated.top,
				left:this.state.animated.left
			}]}>
				<TouchableOpacity style={styles.card_size} onPress={() => {
					BattleActions.event('select_target',this.props.slot_id,this.props.enemy);
				}}>
					<Animated.View style={{
						opacity:this.state.animated.opacity
					}}>
						<ImageBackground style={styles.card_size} source={C.getImage(shape)} resizeMode="contain">
							<Text style={{
								fontSize:30,
								color:'lime'
							}}>{store.get('timed').hp[0]}</Text>
						</ImageBackground>
					</Animated.View>
				</TouchableOpacity>
			</Animated.View>
		)
	}
}
  
export default Bot;