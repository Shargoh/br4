import React from 'react';
import { StyleSheet, PanResponder, Animated, ImageBackground, TouchableOpacity, Text, View } from 'react-native';
import { BattleActions } from '../../engine/actions';
import C from '../../engine/c';
import styles, { screen_width, slots_block_width, block_height, card_size } from './css';

const minW = (screen_width - slots_block_width)/2,
	maxW = minW + slots_block_width,
	W = card_size.w,
	H = card_size.h,
	D1 = 500, // длительность первого переноса карты
	DELAY = 500, // задержка между переносами
	D2 = 500, // длительность второго переноса карты
	D3 = 200, // длительность скрывания карты
	D4 = 500; // длительность прилетания карты

class EnemyTurn extends React.Component {
	componentWillMount(){
		this.setState({
			anim:{
				left:new Animated.Value(0),
				top:new Animated.Value(0),
				opacity:new Animated.Value(1),
				rotate: new Animated.Value(1),
				zIndex: new Animated.Value(0)
			},
			flipped:false
		});
	}
	/**
	 * 
	 * @param {Object} user - данные бота
	 * @param {Number} slot - куда карта полетит 
	 */
	runAnimation(user,slot,line){
		return new Promise((resolve,reject) => {
			Animated.sequence([
				Animated.parallel([
					Animated.timing(this.state.anim.top,{
						toValue:block_height,
						duration:D1
					}),
					Animated.timing(this.state.anim.left,{
						toValue:minW + W + card_size.my - this.props.left,
						duration:D1
					}),
					Animated.timing(this.state.anim.zIndex,{
						toValue:1,
						duration:0
					}),
					Animated.sequence([
						Animated.timing(this.state.anim.rotate,{
							toValue: 0,
							duration: D1/2
						}),
						Animated.timing(this.state.anim.rotate,{
							toValue: 1,
							duration: D1/2
						})
					])
				]),
				Animated.parallel([
					Animated.timing(this.state.anim.left,{
						toValue:minW + (slot - 1)*(W + card_size.my) - this.props.left,
						duration:D2,
						delay:DELAY
					}),
					Animated.timing(this.state.anim.top,{
						toValue:block_height*(line + 1),
						duration:D2,
						delay:DELAY
					})
				])
			]).start(() => {
				resolve();
			});
	
			setTimeout(() => {
				this.setState({
					user:user,
					flipped:true
				})
			},D1/2);
		});
	}
	resetAnimation(){
		return new Promise((resolve,reject) => {
			Animated.sequence([
				Animated.timing(this.state.anim.opacity,{
					toValue:0,
					duration:D3
				}),
				Animated.parallel([
					Animated.timing(this.state.anim.left,{
						toValue:screen_width + minW,
						duration:0
					}),
					Animated.timing(this.state.anim.top,{
						toValue:0,
						duration:0
					})
				]),
				Animated.timing(this.state.anim.opacity,{
					toValue:1,
					duration:0
				}),
				Animated.timing(this.state.anim.left,{
					toValue:0,
					duration:D4
				})
			]).start(() => {
				resolve();
			});

			setTimeout(() => {
				this.setState({
					user:null,
					flipped:false
				})
			},D3/2);
		});
	}
	render(){
		var inside;

		if(this.state.flipped && typeof this.state.user == 'string'){
			let ref = C.refs.ref('battle_turn|'+this.state.user);

			inside = (
				<ImageBackground style={styles.card_size} source={C.getImage(ref.desc.images.active)} resizeMode="contain">
					<Text style={{
						fontSize:30,
						color:'lime'
					}}>{ref.entry}</Text>
				</ImageBackground>
			)
		}else if(this.state.flipped){
			let mob = this.state.user,
				shape = C.refs.ref('user_shape|'+mob.shape);

			inside = (
				<ImageBackground style={styles.card_size} source={C.getImage(shape.thumb)} resizeMode="contain">
					<Text style={{
						fontSize:30,
						color:'lime'
					}}>{mob.timed.hp[0]}</Text>
				</ImageBackground>
			)
		}else{
			inside = (
				<View style={[styles.card_size,{
					backgroundColor:'lime',
				}]}>
					<Text>Card</Text>
				</View>
			)
		}

		return (
			<Animated.View ref={'turn'} style={[styles.card,{
				left:this.state.anim.left,
				top:this.state.anim.top,
				width:this.state.anim.width,
				zIndex:this.state.anim.zIndex,
				opacity:this.state.anim.opacity,
				transform:[
					{scaleX: this.state.anim.rotate},
					{perspective: 1000}
				]
			}]} onLayout={() => {
				// this.refs.turn.measure((x, y, width, height, pageX, pageY) => {
				// 	this.pageX = pageX;
				// });
			}}>
				{inside}
			</Animated.View>
		)
	}
}
  
export default EnemyTurn;