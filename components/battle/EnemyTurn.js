import React from 'react';
import { Animated, ImageBackground, TouchableOpacity, Text, View, Image } from 'react-native';
import { BattleActions } from '../../engine/actions';
import C from '../../engine/c';
import styles, { screen_width, block_height, card_size, info_height } from './css';
import { b_card_back, b_knife, b_ribbon_gray, b_heart } from '../../constants/images';
import Dims from '../../utils/dimensions';
import BattleUtils from '../../utils/battle';

const W = card_size.w,
	D1 = 500, // длительность переноса карты
	DELAY = 500, // задержка между переносом и скрыванием
	D3 = 0, // длительность скрывания карты
	D4 = 500; // длительность прилетания карты

export function calcActionDuration(){
	return D1 + D3 + D4;
}

class EnemyTurn extends React.Component {
	componentWillMount(){
		this.setState({
			anim:{
				left:new Animated.Value(0),
				top:new Animated.Value(0),
				opacity:new Animated.Value(1),
				rotate: new Animated.Value(1),
				zIndex: new Animated.Value(0 + this.props.index)
			},
			flipped:false,
			margin_top:this.props.index == 1 ? card_size.h/16 : 0
		});

		if(!this.deg){
			this.deg = {
				anim:new Animated.Value(0)
			};

			switch(this.props.index){
				case 0:
					this.deg.value = '5deg';
					break;
				case 2:
					this.deg.value = '-5deg';
					break;
				default:
					this.deg.value = '0deg';
					break;
			}

			this.deg.interpolate = this.deg.anim.interpolate({
				inputRange: [0,1,2],
				outputRange: [this.deg.value,'0deg','5deg']
			});
		}
	}
	/**
	 * 
	 * @param {Object} user - данные бота
	 * @param {Number} slot - куда карта полетит 
	 */
	runAnimation(user,slot,line){
		return new Promise((resolve,reject) => {
			Animated.parallel([
				Animated.timing(this.state.anim.zIndex,{
					toValue:1 + this.props.index,
					duration:0
				}),
				Animated.timing(this.deg.anim,{
					toValue:1,
					duration:D1
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
				]),
				Animated.timing(this.state.anim.left,{
					toValue:screen_width/2 + (slot - 3.5)*(W + card_size.my*2) + card_size.my - this.props.left,
					duration:D1
				}),
				Animated.timing(this.state.anim.top,{
					toValue:block_height*(line) + info_height - this.state.margin_top/2,
					duration:D1
				})
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
					duration:D3,
					delay:DELAY
				}),
				Animated.parallel([
					Animated.timing(this.state.anim.left,{
						toValue:screen_width - Dims.pixel(410) - this.props.left,
						duration:0
					}),
					Animated.timing(this.state.anim.top,{
						toValue:3*block_height + 2*info_height + Dims.pixel(-30),
						duration:0
					}),
					Animated.timing(this.deg.anim,{
						toValue:2,
						duration:0
					})
				]),
				Animated.timing(this.state.anim.opacity,{
					toValue:1,
					duration:0
				}),
				Animated.parallel([
					Animated.timing(this.state.anim.left,{
						toValue:0,
						duration:D4
					}),
					Animated.timing(this.state.anim.top,{
						toValue:0,
						duration:D4
					}),
					Animated.timing(this.deg.anim,{
						toValue:0,
						duration:D4
					})
				])
			]).start(() => {
				resolve();
			});

			setTimeout(() => {
				this.setState({
					user:null,
					flipped:false
				})
			},D3/2 + DELAY);
		});
	}
	render(){
		var inside,
			style;

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
					<ImageBackground style={styles.dmg_bg} source={C.getImage(b_ribbon_gray)} resizeMode="contain">
						<Image style={styles.icon} source={C.getImage(b_knife)} resizeMode="contain" />
						<Text style={styles.card_text}>{mob.stats.stats.damage}</Text>
					</ImageBackground>
					<ImageBackground style={styles.hp_bg} source={C.getImage(b_ribbon_gray)} resizeMode="contain">
						<Image style={styles.icon} source={C.getImage(b_heart)} resizeMode="contain" />
						<Text style={styles.card_text}>{mob.timed.hp[0]}</Text>
					</ImageBackground>
				</ImageBackground>
			)
		}else{
			inside = (
				<Image style={styles.card_size} source={C.getImage(b_card_back)} resizeMode="cover" />
			)
		}

		if(this.props.index == 1){
			style = {
				marginTop:this.state.margin_top
			}
		}

		return (
			<Animated.View ref={'turn'} style={[styles.turn,style,{
				left:this.state.anim.left,
				top:this.state.anim.top,
				width:this.state.anim.width,
				zIndex:this.state.anim.zIndex,
				opacity:this.state.anim.opacity,
				transform:[
					{scaleX: this.state.anim.rotate},
					{perspective: 1000},
					{rotate:this.deg.interpolate}
				]
			}]} onLayout={() => {
				// this.refs.turn.measure((x, y, width, height, pageX, pageY) => {
				// 	this.pageX = pageX;
				// });
			}}>
				{inside}
				{this.state.user ? BattleUtils.compileBotDelayCmp(this.state.user.aura) : undefined}
			</Animated.View>
		)
	}
}
  
export default EnemyTurn;