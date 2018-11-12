import React from 'react';
import Reflux from 'reflux';
import DragComponent from '../../engine/views/drag_component';
import { StyleSheet, PanResponder, Animated, ImageBackground, TouchableOpacity, Text } from 'react-native';
import GlobalActions, { BattleActions } from '../../engine/actions';
import C from '../../engine/c';
import styles, { screen_width, slots_block_width, block_height, card_size } from './css';

const minW = (screen_width - slots_block_width)/2,
	cardW = card_size.w + card_size.my,
	maxW = minW + slots_block_width,
	W = card_size.w,
	H = card_size.h,
	bh2 = block_height*2,
	bh3 = block_height*3,
	bh4 = block_height*4,
	bh5 = block_height*5,
	cl = minW + 2*cardW,
	cr = maxW - 2*cardW,
	KS_DELAY = 500,
	KS = 1000;

/**
 * flags
 * _animating_kick_success
 * _waiting_reset_animation
 */

class Turn extends DragComponent {
	constructor(props){
		super(props);

		this.block = 0;
	}
	setDropArea(){
		switch(this.getTargetType()){
			case 1:
				this.isDropArea = this.isInSlotDropArea;
				break;
			case 3:
				this.isDropArea = this.isInSlotDropArea;
				break;
			case 2:
				this.isDropArea = this.isEnemySlotDropArea;
				break;
			case 4:
				this.isDropArea = this.isEnemyHeroDropArea;
				break;
			case 5:
				this.isDropArea = this.isHeroDropArea;
				break;
			case 6:
				this.isDropArea = this.isEnemyDropArea;
				break;
			case 7:
				this.isDropArea = this.isMyDropArea;
				break;
		}
	}
	isInSlotDropArea(gesture) {
		return gesture.moveY < bh4 && 
			gesture.moveY > bh3 && 
			gesture.moveX < maxW && 
			gesture.moveX > minW;
	}
	isEnemySlotDropArea(gesture) {
		return gesture.moveY < bh3 && 
			gesture.moveY > bh2 && 
			gesture.moveX < maxW && 
			gesture.moveX > minW;
	}
	isEnemyHeroDropArea(gesture) {
		return gesture.moveY < bh2 && 
			gesture.moveY > block_height && 
			gesture.moveX < cr && 
			gesture.moveX > cl;
	}
	isHeroDropArea(gesture) {
		return gesture.moveY < bh5 && 
			gesture.moveY > bh4 && 
			gesture.moveX < cr && 
			gesture.moveX > cl;
	}
	isEnemyDropArea(gesture) {
		return (
			gesture.moveY < bh2 && 
			gesture.moveY > block_height && 
			gesture.moveX < cr && 
			gesture.moveX > cl
		) || (
			gesture.moveY < bh3 && 
			gesture.moveY > bh2 && 
			gesture.moveX < maxW && 
			gesture.moveX > minW
		);
	}
	isMyDropArea(gesture) {
		return (
			gesture.moveY < bh5 && 
			gesture.moveY > bh4 && 
			gesture.moveX < cr && 
			gesture.moveX > cl
		) || (
			gesture.moveY < bh4 && 
			gesture.moveY > bh3 && 
			gesture.moveX < maxW && 
			gesture.moveX > minW
		);
	}
	isDisabled(){
		if(!this.props.kick) return true;
		if(this.props.kick.priority == -1) return true;

		return false;
	}
	/**
	 * 1 - карта ставится в слот
	 * 2 - карта воздействует на противника в слоте
	 * 3 - карта воздействует на своего в слоте
	 * 4 - карта воздействует на вражеского героя
	 * 5 - карта воздействует на себя
	 * 6 - карта воздействует на вражеского героя или противника в слоте
	 * 7 - карта воздействует на себя или своего в слоте
	 */
	getTargetType(){
		var kick = this.props.kick,
			slot = Number(kick.slot),
			side = kick.side;

		if(kick.is_slot) return 1;
		if(slot == 1 && side == 2) return 2;
		if(slot == 1 && side == 1) return 3;
		if(slot == 2 && side == 2) return 4;
		if(slot == 2 && side == 1) return 5;
		if(!slot && side == 2) return 6;
		if(!slot && side == 1) return 7;
	}
	getTransformData(){
		var transform = this.state.pan.getTranslateTransform();

		if(!this.deg){
			this.deg = {
				anim:new Animated.Value(0)
			};

			switch(this.props.index){
				case 0:
					this.deg.value = '-5deg';
					break;
				case 2:
					this.deg.value = '5deg';
					break;
				default:
					this.deg.value = '0deg';
					break;
			}

			this.deg.interpolate = this.deg.anim.interpolate({
				inputRange: [0,1],
				outputRange: [this.deg.value,'0deg']
			});
		}

		transform.push({rotate:this.deg.interpolate});

		return transform;
	}
	renderContent(){
		var kick = this.props.kick,
			ref = C.refs.ref('battle_turn|'+kick.name);

		this.setDropArea();

		return (
			<TouchableOpacity ref={'turn'} key={kick.name} style={styles.card} onPress={() => {
				if(!this.isDisabled(kick)){
					BattleActions.kick(kick.name,this);
				}
			}} onLayout={() => {
				if(!this._animating_kick_success && !this._waiting_reset_animation){
					this.setPageX();
				}
			}}>
				<ImageBackground style={styles.card} source={C.getImage(ref.desc.images.active)} resizeMode="contain">
					<Text style={{
						fontSize:40,
						color:'blue'
					}}>{this.getTargetType()}</Text>
				</ImageBackground>
			</TouchableOpacity>
		)
	}
	onStartDrag(e,gesture){
		const x = gesture.x0,
			y = gesture.y0;

		this.setState({
			dx:x - this.props.left - W/2,
			dy:y - this.props.top - H/2
		});

		Animated.timing(this.deg.anim,{
			toValue:1,
			duration:200
		}).start();

		// this.props.container.onStartDrag(e,gesture);
	}
	animateWrongDrop(e, gesture){
		Animated.parallel([
			Animated.spring(this.state.pan, {
				toValue: { x: 0, y: 0 },
				friction: 5
			}),
			Animated.timing(this.deg.anim,{
				toValue:0,
				duration:200
			})
		]).start(() => {
			this.onDrop(e,gesture,false);
		});
	}
	onDrop(e,gesture,in_drop_area){
		// this.props.container.onDrop(e,gesture,in_drop_area);

		if(!in_drop_area){
			//
		}else{
			let block = this.block == 100 ? 100 : Math.max(1,Math.min(5,this.block));

			return BattleActions.kick(this.props.kick.name,this,block);
		}
	}
	animateCorrectDrop(e,gesture){
		return this.onDrop(e,gesture,true);
	}
	animateKickSuccess(){
		this._animating_kick_success = true;

		GlobalActions.log('Animating user kick success');

		Animated.sequence([
			Animated.timing(this.state.opacity, {
				toValue: 0,
				duration: KS,
				delay:KS_DELAY
			}),
			Animated.timing(this.state.pan, {
				duration: 0,
				toValue: { x: screen_width - cardW - card_size.my, y: 0 },
			})
		]).start(() => {
			this._animating_kick_success = false;

			GlobalActions.log('User kick successfully animated. Waiting?',this._waiting_reset_animation);

			if(this._waiting_reset_animation){
				this.animatedResetPosition();
			}
		});
	}
	animateCorrectSelection(slot_id,side){
		return new Promise((resolve,reject) => {
			var y;

			if(slot_id == 100){
				slot_id = 3;

				if(side == 1){
					y = -1*block_height;
				}else{
					y = -4*block_height;
				}
			}else if(side == 2){
				y = -3*block_height;
			}else{
				y = -2*block_height;
			}

			y += card_size.my/2;

			var slot_x = minW + (slot_id - 1)*(W + card_size.my) + card_size.my/2;

			Animated.parallel([
				Animated.timing(this.state.pan, {
					duration: 200,
					toValue: { x: slot_x - this.pageX, y: y },
				}),
				Animated.timing(this.deg.anim, {
					duration: 200,
					toValue: 0,
				})
			]).start(() => {
				resolve();
			});
		});
	}
	animatedResetPosition(){
		if(this._animating_kick_success){
			GlobalActions.log('Cannot animate reset. User still kicking');

			this._waiting_reset_animation = true;
			return;
		}else{
			GlobalActions.log('Animating user card reset');

			this._waiting_reset_animation = true;

			Animated.sequence([
				Animated.timing(this.state.opacity, {
					toValue: 1,
					duration: 1000
				}),
				Animated.parallel([
					Animated.timing(this.state.pan, {
						duration: 500,
						delay: 200,
						toValue: { x: 0, y: 0 }
					}),
					Animated.timing(this.deg.anim, {
						duration: 500,
						delay: 200,
						toValue: 1
					})
				])
			]).start(() => {
				this._waiting_reset_animation = false;
				this.setPageX();
			});
		}
	}
	setPageX(){
		this.refs.turn.measure((x, y, width, height, pageX, pageY) => {
			this.pageX = pageX;
		});
	}
	/**
	 * если блок находится вне слотов (по высоте) - значит он равен 100, т.к. это герой
	 */
	getBlock(gesture){
		let x = gesture.moveX - this.state.dx - minW,
			y = gesture.moveY - this.state.dy;

		if(y < bh2 || y > bh5){
			return 100;
		}else{
			// console.log(Math.floor(x/cardW) + 1,x,minW);
			return Math.floor(x/cardW) + 1;
		}
	}
	onMove(e,gesture){
		if(this.isDropArea(gesture)){
			let block = this.getBlock(gesture),
				current = this.block;

			if(block != current){
				this.block = block;
				BattleActions.event('highlight_quick_slot',block - 1);
			}
		}else{
			this.block = 0;
		}
	}
}
  
export default Turn;