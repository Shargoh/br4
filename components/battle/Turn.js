import React from 'react';
import DragComponent from '../../engine/views/drag_component';
import { StyleSheet, PanResponder, Animated, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { BattleActions } from '../../engine/actions';
import C from '../../engine/c';
import styles, { screen_width, slots_block_width, block_height, card_size } from './css';

const minW = (screen_width - slots_block_width)/2,
	maxW = minW + slots_block_width,
	W = card_size.w,
	H = card_size.h;

class Turn extends DragComponent {
	constructor(props){
		super(props);

		this.block = 0;
	}
	isDropArea(gesture) {
		return gesture.moveY < block_height*4 && 
			gesture.moveY > block_height*3 && 
			gesture.moveX < maxW && 
			gesture.moveX > minW;
	}
	isDisabled(){
		if(!this.props.kick) return true;
		if(this.props.kick.priority == -1) return true;

		return false;
	}
	renderContent(){
		var kick = this.props.kick,
			ref = C.refs.ref('battle_turn|'+kick.name);

		return (
			<TouchableOpacity key={kick.name} style={styles.card} onPress={() => {
				if(!this.isDisabled(kick)){
					BattleActions.kick(kick.name);
				}
			}}>
				<ImageBackground style={styles.card} source={C.getImage(ref.desc.images.active)} resizeMode="contain">
					<Text>123</Text>
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

		// this.props.container.onStartDrag(e,gesture);
	}
	onDrop(e,gesture,in_drop_area){
		// this.props.container.onDrop(e,gesture,in_drop_area);

		if(!in_drop_area){
			// return BattleActions.event('unselect');
		}else{
			return BattleActions.kick(this.props.kick.name,Math.max(1,Math.min(5,this.block + 1)));
		}
	}
	getBlock(gesture){
		let x = gesture.moveX - this.state.dx,
				y = gesture.moveY - this.state.dy;

		return Math.floor(x/W) + 1;
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