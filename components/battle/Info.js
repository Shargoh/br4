import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import styles from './css';
import { BattleActions } from '../../engine/actions.js';

class Info extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
	}
	render() {
		var user_image,
			hp;

		if(this.props.user){
			let shape = C.refs.ref('user_shape|'+this.props.user.shape);

			user_image = C.getImage(shape.thumb);
			hp = this.props.user.timed.hp[0];
		}

		return (
			<TouchableOpacity onPress={() => {
				var enemy = this.store.getEnemy();

				BattleActions.event('select_hero',enemy && enemy.battle.ekey == this.props.user.battle.ekey);
			}}>
				<ImageBackground style={styles.card} source={user_image}>
					<Text style={styles.text}>
						{hp}
					</Text>
				</ImageBackground>
			</TouchableOpacity>
		)
	}
}
  
export default Info;