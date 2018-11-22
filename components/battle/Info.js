import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, View, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native';
import styles from './css';
import { BattleActions } from '../../engine/actions.js';
import { b_avatar_border, b_avatar_signs, b_avatar_heart } from '../../constants/images.js';
import Dims from '../../utils/dimensions.js';

const top = Dims.pixel(68),
	bottom = Dims.pixel(62);

class Info extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
	}
	render() {
		var user_image,
			flip,
			hp;

		if(this.props.user){
			let shape = C.refs.ref('user_shape|'+this.props.user.shape);

			user_image = C.getImage(shape.thumb);
			hp = this.props.user.timed.hp[0];
		}

		if(this.props.enemy){
			flip = {
				transform:[{rotateX:'180deg'}],
				bottom:bottom
			}
		}else{
			flip = {
				top:top
			}
		}

		return (
			<TouchableOpacity style={[styles.avatar_size,styles.avatar_box]} onPress={() => {
				var enemy = this.store.getEnemy();

				BattleActions.event('select_hero',enemy && enemy.battle.ekey == this.props.user.battle.ekey);
			}}>
				<Image style={styles.hero} source={user_image} />
				<Image style={[{
					position:'absolute',
					height:Dims.pixel(390),
					width:Dims.pixel(364)
				},flip]} source={C.getImage(b_avatar_border)} />
				<Image style={[styles.avatar_size,{
					position:'absolute',
					top:0
				}]} source={C.getImage(b_avatar_signs)} />
				<ImageBackground style={styles.avatar_heart} source={C.getImage(b_avatar_heart)}>
					<Text style={styles.avatar_hp}>
						{hp}
					</Text>
				</ImageBackground>
			</TouchableOpacity>
		)
	}
}
  
export default Info;