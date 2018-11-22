import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, Image, View, Text, Animated } from 'react-native';
import GlobalActions, { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles from './css';
import Bot from './Bot';
import { b_slot_bg } from '../../constants/images.js';

class Slots extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setSlots();
	}
	/**
	 * @param {String} action 
	 * @param {Object} data 
	 *  @param {Object} user - user data 
	 *  @param {Number} side - 1 (friend) or 2 (enemy)
	 *  @param {Number} slot - 1-5
	 */
	onAction(action,data){
		if(
			action == 'added_in_slot' &&
			(
				(this.props.enemy && data.side == 2) ||
				(!this.props.enemy && data.side == 1)
			)
		){
			this.state.slots[data.slot - 1] = data.user.battle.ekey;
			this.setState({
				slots:this.state.slots
			});

			let cmp = this.refs['slot'+data.slot];

			if(cmp){
				cmp.animateAddInSlot(data.user,data.slot);
			}
		}else if(
			action == 'remove_from_slot' &&
			(
				(this.props.enemy && data.side == 2) ||
				(!this.props.enemy && data.side == 1)
			)
		){
			let cmp = this.refs['slot'+data.slot];

			if(cmp){
				// тут анимация по идее параллельна
				cmp.animateRemoveFromSlot(data.slot);
			}
		}else if(
			action == 'slot_kick' &&
			(
				(this.props.enemy && data.side == 2) ||
				(!this.props.enemy && data.side == 1)
			)
		){
			// на всякий пожарный, вдруг после F5 придут данные до отрисовки
			// временно не обрабатываю если нет цели. Потом будет анимация в зависимости от удара
			if(!this.state || !data.data.u2){
				if(data.resolve){
					data.resolve();
				}

				return;
			}

			let u = data.data.u || data.data.u1,
				slots = this.state.slots,
				i = slots.length,
				slot;

			while(i--){
				if(slots[i] == u[2]){
					slot = i + 1;
					break;
				}
			}

			let cmp = this.refs['slot'+slot];

			if(cmp){
				cmp.animateKick(data.data,slot,data.resolve);
			}
		}
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
					const slot_id = index + 1,
						mob = ekey_map[ekey];

					if(mob && !mob.isDead()){
						return (
							<Bot key={slot_id} ref={'slot'+slot_id} enemy={this.props.enemy} slot_id={slot_id} store={mob} />
						)
					}else{
						return (
							<TouchableOpacity key={slot_id} style={styles.card} onPress={() => {
								if(!this.props.enemy){
									BattleActions.event('select_slot',slot_id);
								}
							}}>
								<Image style={styles.card_size} source={C.getImage(b_slot_bg)} />
							</TouchableOpacity>
						)
					}
				})}
			</View>
    )
  }
}
  
export default Slots;