import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, Animated, ImageBackground, Image, TouchableOpacity } from 'react-native';
import styles from './css';
import { BattleActions } from '../../engine/actions.js';
import { b_avatar_border, b_avatar_signs, b_avatar_heart } from '../../constants/images.js';
import Dims from '../../utils/dimensions.js';

const top = Dims.pixel(78),
	bottom = Dims.pixel(73);

class Info extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');

		this.setState({
			animated:{
				hl_opacity:new Animated.Value(0)
			}
		});
	}
	onAction(action,store){
		if(
			(action == 'hl_enemy_hero' && this.props.enemy) ||
			(action == 'hl_my_hero' && !this.props.enemy)
		){
			Animated.timing(this.state.animated.hl_opacity,{
				toValue:1,
				duration:200
			}).start();
		}else if(action == 'unhl'){
			Animated.timing(this.state.animated.hl_opacity,{
				toValue:0,
				duration:200
			}).start();
		}
	}
	render() {
		var user_image,
			flip,
			style,
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
			style = styles.enemy_avatar_box;
		}else{
			flip = {
				top:top
			}
			style = styles.my_avatar_box;
		}

		return (
			<TouchableOpacity style={[styles.avatar_size,styles.avatar_box,style]} onPress={() => {
				var enemy = this.store.getEnemy();

				BattleActions.event('select_hero',enemy && enemy.battle.ekey == this.props.user.battle.ekey);
			}}>
				<Image style={styles.hero} source={user_image} />
				<Image style={[{
					position:'absolute',
					height:Dims.pixel(390),
					width:Dims.pixel(364)
				},flip]} source={C.getImage(b_avatar_border)} />
				<Animated.Image style={[styles.avatar_size,{
					position:'absolute',
					top:0,
					opacity:this.state.animated.hl_opacity
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