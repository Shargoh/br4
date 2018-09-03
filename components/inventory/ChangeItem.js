import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import DraggableItem from './DraggableItem';
import { StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { InventoryActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import Dims from '../../utils/dimensions';

const TOP = Dims.itemSide()*3,
	LEFT = Dims.itemSide()*1.5;

const styles = StyleSheet.create({
  item: {
    flex:1,
		justifyContent:'center',
		width:Dims.itemSide(),
		height:Dims.itemSide(),
		marginTop:TOP,
		marginLeft:LEFT,
		marginRight:LEFT
	},
	inside: {
		flex:1,
		justifyContent:'center',
	},
	view_anim_on: {
    zIndex:1
	},
	view_anim_off: {
		zIndex:0
	}
});

class ChangeItem extends RefluxComponent {
	constructor(props){
		super(props);

		this.state = {
			view_anim_style:{}
		}
	}
	componentWillMount(){
		this.bindService('inventory');
	}
	compileItem(){
		var item = this.service.store.get('context').item;
		
		return {
			type:'item',
			params:{
				quantity:item.param.count || 1,
				id:item.proto_id
			},
			items_params:item
		};
	}
	onStartDrag(e,gesture){
		this.setState({
			view_anim_style:styles.view_anim_on
		});
	}
	onDrop(e,gesture,in_drop_area){
		this.setState({
			view_anim_style:styles.view_anim_off
		});
	}
  render() {
		return (
			<TouchableOpacity style={[{
				position:'absolute',
				top:0,
				bottom:0,
				left:0,
				right:0,
				flexDirection:'row',
				justifyContent:'center'
			},this.state.view_anim_style]} onPress={() => {
				InventoryActions.event('unselect')
			}}>
				{/* <TouchableOpacity style={styles.item} ref={'view'} onPress={() => {
					InventoryActions.event('context',this.refs.view,this.props.item)
				}}> */}
					<ImageBackground style={styles.item} source={C.getImage('ds1/slots/new/empty.jpg')} resizeMode="contain">
						<DraggableItem item={this.compileItem()} container={this} top={TOP} left={LEFT} />
					</ImageBackground>
				{/* </TouchableOpacity> */}
			</TouchableOpacity>
    )
  }
}
  
export default ChangeItem;