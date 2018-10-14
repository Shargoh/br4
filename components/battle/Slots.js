import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, ImageBackground, View, Text, Animated } from 'react-native';
import GlobalActions, { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles from './css.js';

const D1 = 500, // время на исчезновение
	D2 = 200; // время на появление

class Slots extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setSlots();

		if(this.props.enemy){
			this.animateAddInSlot = this.animateEnemyAddInSlot;
		}else{
			this.animateAddInSlot = this.animateFriendlyAddInSlot;
		}

		this.animated_slots = {};
	}
	/**
	 * @param {String} action 
	 * @param {Object} user - user data 
	 * @param {Number} side - 1 (friend) or 2 (enemy)
	 * @param {Number} slot - 1-5
	 */
	onAction(action,user,side,slot){
		if(
			action == 'added_in_slot' &&
			(
				(this.props.enemy && side == 2) ||
				(!this.props.enemy && side == 1)
			)
		){
			this.state.slots[slot - 1] = user.battle.ekey;
			this.setState({
				slots:this.state.slots
			});

			if(this.animated_slots[slot]){
				this.animateAddInSlot(user,slot);
			}
		}else if(
			action == 'remove_from_slot' &&
			(
				(this.props.enemy && side == 2) ||
				(!this.props.enemy && side == 1)
			)
		){
			// тут анимация по идее параллельна
			this.animateRemoveFromSlot(slot);
		}
	}
	animateEnemyAddInSlot(user,slot){
		Animated.timing(this.animated_slots[slot].opacity,{
			toValue:1,
			duration:D2
		}).start();
	}
	animateFriendlyAddInSlot(user,slot){
		Animated.timing(this.animated_slots[slot].opacity,{
			toValue:1,
			duration:D2
		}).start();
	}
	animateRemoveFromSlot(slot){
		Animated.timing(this.animated_slots[slot].opacity,{
			toValue:0,
			duration:D1
		}).start();
	}
	setSlots(){
		const slots = {
			1:'',
			2:'',
			3:'',
			4:'',
			5:''
		};

		GlobalActions.log('SLOTS_CMP',this.props.slots)

		for(let slot_id in this.props.slots){
			if(slot_id <= 5){
				slots[slot_id] = this.props.slots[slot_id];
			}
		}

		this.setState({
			slots:Object.values(slots)
		});
	}
	render(){
		var ekey_map = this.store.get('ekey_map');

		return (
			<View style={[this.props.enemy ? styles.enemy_slots : styles.my_slots,styles.slots_block]}>
				{this.state.slots.map((ekey,index) => {
					const slot_id = index + 1;

					if(ekey && ekey_map[ekey] && ekey_map[ekey].timed.hp[0]){
						let mob = ekey_map[ekey],
							shape = C.refs.ref('user_shape|'+mob.shape);

						this.animated_slots[slot_id] = {
							opacity:new Animated.Value(1)
						}

						return (
							<TouchableOpacity key={slot_id} style={styles.card} onPress={() => {
								BattleActions.event('select_target',slot_id,this.props.enemy);
							}}>
								<Animated.View ref={'slot'+slot_id} style={this.animated_slots[slot_id]}>
									<ImageBackground style={styles.card_size} source={C.getImage(shape.thumb)} resizeMode="contain">
										<Text style={{
											fontSize:30,
											color:'lime'
										}}>{mob.timed.hp[0]}</Text>
									</ImageBackground>
								</Animated.View>
							</TouchableOpacity>
						)
					}else{
						return (
							<TouchableOpacity key={slot_id} style={styles.card} onPress={() => {
								if(!this.props.enemy){
									BattleActions.event('select_slot',slot_id);
								}
							}}>
								
							</TouchableOpacity>
						)
					}
				})}
			</View>
    )
  }
}
  
export default Slots;