import React from 'react';
import DragComponent from '../../engine/views/drag_component';
import { StyleSheet, PanResponder, Animated, ImageBackground, TouchableOpacity } from 'react-native';
import { InventoryActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import Dims from '../../utils/dimensions';

const W = Dims.itemSide(),
	H = Dims.itemSide(),
	INROW = 4;

class DraggableItem extends DragComponent {
	constructor(props){
		super(props);

		this.block = 0;
	}
	isDropArea(gesture) {
    return gesture.moveY < H*2;
	}
	renderContent(){
		return C.getManager('stuff').image(this.props.item);
	}
	onStartDrag(e,gesture){
		const x = gesture.x0,
			y = gesture.y0;

		this.setState({
			dx:x - this.props.left - W/2,
			dy:y - this.props.top - H/2
		})

		this.props.container.onStartDrag(e,gesture);
	}
	onDrop(e,gesture,in_drop_area){
		this.props.container.onDrop(e,gesture,in_drop_area);

		if(!in_drop_area){
			return InventoryActions.event('unselect');
		}else{
			return InventoryActions.event('drop',this.block - 1);
		}
	}
	getBlock(gesture){
		let x = gesture.moveX - this.state.dx,
				y = gesture.moveY - this.state.dy;

		return Math.floor(x/W) + 1 + Math.floor(y/H)*INROW;
	}
	onMove(e,gesture){
		if(this.isDropArea(gesture)){
			let block = this.getBlock(gesture),
				current = this.block;

			if(block != current){
				this.block = block;
				InventoryActions.event('highlight_quick_slot',block - 1);
			}
		}else{
			this.block = 0;
		}
	}
}
  
export default DraggableItem;