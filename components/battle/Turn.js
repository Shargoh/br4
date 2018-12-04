import React from 'react';
import Reflux from 'reflux';
import DragComponent from '../../engine/views/drag_component';
import { Image, Animated, ImageBackground, TouchableOpacity, Text } from 'react-native';
import GlobalActions, { BattleActions } from '../../engine/actions';
import C from '../../engine/c';
import styles, { screen_width, slots_block_width, block_height, card_size, info_height, flags_margin, bottom_delta } from './css';
import { b_heart, b_ribbon_gray, b_knife, b_card_back } from '../../constants/images';
import Dims from '../../utils/dimensions';
import BattleUtils from '../../utils/battle';

const minW = BattleUtils.calcSlotLeft(1),
	cardW = card_size.w + card_size.my*2,
	maxW = BattleUtils.calcSlotLeft(6),
	W = card_size.w,
	H = card_size.h,
	bh2 = block_height + info_height,
	bh3 = block_height*2 + info_height,
	bh4 = block_height*3 + info_height,
	bh5 = block_height*3 + info_height*2,
	cl = BattleUtils.calcSlotLeft(2.5),
	cr = BattleUtils.calcSlotLeft(4.5),
	KS_DELAY = 500,
	KS = 1000,
	D1 = 200, // время появления карты на колоде
	D2 = 500, // время полета карты из колоды
	D2_DELAY = 0; // задержка перед полетом карты из колоды

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
				inputRange: [0,1,2],
				outputRange: [this.deg.value,'0deg','5deg']
			});
		}

		if(!this.scale){
			this.scale = {
				anim:new Animated.Value(1)
			}
		}

		transform.push({rotate:this.deg.interpolate});
		transform.push({scaleX:this.scale.anim});
		transform.push({perspective:1000});

		return transform;
	}
	renderContent(){
		var kick = this.props.kick,
			ref = C.refs.ref('battle_turn|'+kick.name),
			prognoz = ref.desc.prognoz.battle,
			inside;

		this.setDropArea();

		if(this.state.flipped){
			inside = (
				<Image style={styles.card_size} source={C.getImage(b_card_back)} resizeMode="cover" />
			)
		}else{
			inside = (
				<ImageBackground style={styles.card} source={C.getImage(ref.desc.images.active)} resizeMode="contain">
					{/* <Text style={{
						fontSize:40,
						color:'blue'
					}}>{this.getTargetType()}</Text> */}
					<ImageBackground style={styles.dmg_bg} source={C.getImage(b_ribbon_gray)} resizeMode="contain">
						<Image style={styles.icon} source={C.getImage(b_knife)} resizeMode="contain" />
						<Text style={styles.card_text}>{Number(prognoz.top.prognoz_template) || '?'}</Text>
					</ImageBackground>
					<ImageBackground style={styles.hp_bg} source={C.getImage(b_ribbon_gray)} resizeMode="contain">
						<Image style={styles.icon} source={C.getImage(b_heart)} resizeMode="contain" />
						<Text style={styles.card_text}>{Number(prognoz.bottom.prognoz_template) || '?'}</Text>
					</ImageBackground>
				</ImageBackground>
			)
		}

		return (
			<TouchableOpacity ref={'turn'} key={kick.name} style={styles.card} onPress={() => {
				if(!this.isDisabled(kick)){
					BattleActions.event('highlight_available_slot',this.props.kick,this.getTargetType());
					BattleActions.kick(kick.name,this);
				}
			}} onLayout={() => {
				if(!this._animating_kick_success && !this._waiting_reset_animation){
					this.setPageX();
				}
			}}>
				{inside}
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

		BattleActions.event('highlight_available_slot',this.props.kick,this.getTargetType());

		// this.props.container.onStartDrag(e,gesture);
	}
	animateWrongDrop(e, gesture){
		BattleActions.event('unhighlight_available_slot');
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
		BattleActions.event('unhighlight_available_slot');
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
			Animated.parallel([
				Animated.timing(this.state.pan, {
					duration: 0,
					toValue: {
						x: screen_width - Dims.pixel(645) - flags_margin - this.pageX, 
						y: bottom_delta + Dims.pixel(-30)
					},
				}),
				Animated.timing(this.deg.anim,{
					toValue:2,
					duration:0
				})
			])
		]).start(() => {
			this._animating_kick_success = false;

			this.setState({
				flipped:true
			});

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
					y = -1*info_height;
				}else{
					y = -2*block_height - 2*info_height;
				}
			}else if(side == 2){
				y = -2*block_height - info_height;
			}else{
				y = -1*block_height - info_height;
			}

			y -= this.props.margin_top;

			// var slot_x = minW + (slot_id - 1)*(W + card_size.my) + card_size.my/2;
			var slot_x = screen_width/2 + (slot_id - 1 - 2.5)*(W + card_size.my*2) + card_size.my;

			Animated.parallel([
				Animated.timing(this.state.pan, {
					duration: 200,
					toValue: { x: slot_x - this.props.left, y: y },
				}),
				Animated.timing(this.deg.anim, {
					duration: 200,
					toValue: 1,
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
		}else if(this.state.flipped){
			GlobalActions.log('Animating user card reset');

			this._waiting_reset_animation = true;

			setTimeout(() => {
				this.setState({
					flipped:false
				});
			},D2_DELAY + D2/2);

			Animated.parallel([
				Animated.timing(this.state.opacity, {
					toValue: 1,
					duration: D1
				}),
				Animated.sequence([
					Animated.timing(this.scale.anim,{
						toValue:0,
						delay:D2_DELAY,
						duration:D2/2
					}),
					Animated.timing(this.scale.anim,{
						toValue:1,
						duration:D2/1
					})
				]),
				Animated.timing(this.state.pan, {
					duration: D2,
					delay: D2_DELAY,
					toValue: { x: 0, y: 0 }
				}),
				Animated.timing(this.deg.anim, {
					duration: D2,
					delay: D2_DELAY,
					toValue: 0
				})
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
		let x = gesture.moveX - this.state.dx - minW + card_size.my,
			y = gesture.moveY - this.state.dy;

		if(y < bh2 || y > bh4){
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