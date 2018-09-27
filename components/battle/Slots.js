import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, ImageBackground, View, Text } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles from './css.js';

class Slots extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setSlots();
	}
	onAction(action,store){
		if(action == 'change' && store.changed.slots){
			this.setSlots();
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

		console.log(this.props.slots)

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

					if(ekey && ekey_map[ekey]){
						let mob = ekey_map[ekey],
							shape = C.refs.ref('user_shape|'+mob.shape);

						return (
							<ImageBackground key={slot_id} style={styles.card} source={C.getImage(shape.thumb)} resizeMode="contain">
								<Text style={{
									fontSize:30,
									color:'lime'
								}}>{mob.timed.hp[0]}</Text>
							</ImageBackground>
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