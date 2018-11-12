import { StyleSheet } from 'react-native';
import Dims from '../../utils/dimensions.js';

/**
 * Посчитаем высоту и ширину карты
 */
export const card_size = Dims.cardSize();
export const screen_width = Dims.width(1);
export const turn_block_width = (card_size.w + card_size.my)*3;
export const slots_block_width = (card_size.w + card_size.my)*5;
export const block_height = card_size.h + 2*card_size.my;

const styles = StyleSheet.create({
  text:{
		fontSize:30,
		color:'lime'
	},
	card:{
		height:card_size.h,
		width:card_size.w,
		margin:card_size.my/2,
		borderRadius:card_size.mx,
		borderWidth:1,
		borderColor:'#000',
		alignItems:'center',
		justifyContent:'center'
	},
	card_size:{
		height:card_size.h,
		width:card_size.w,
		borderRadius:card_size.mx,
	},
	turn:{
		height:card_size.h,
		width:card_size.w,
		marginLeft:-card_size.my/4,
		marginRight:-card_size.my/4,
		borderRadius:card_size.mx,
		borderWidth:1,
		borderColor:'#000',
		alignItems:'center',
		justifyContent:'center'
	},
	turn_block:{
		height:block_height,
		width:turn_block_width,
		flexDirection:'row',
		position:'absolute',
		left:(screen_width - turn_block_width)/2,
		alignItems:'center',
		justifyContent:'center'
	},
	my_turn_block:{
		bottom:0
	},
	enemy_turn_block:{
		top:0
	},
	slots_block:{
		height:block_height,
		width:slots_block_width,
		flexDirection:'row',
		position:'absolute',
		left:(screen_width - slots_block_width)/2,
		alignItems:'center',
		justifyContent:'center'
	},
	enemy_slots:{
		top:block_height*2
	},
	my_slots:{
		top:block_height*3
	}
});

export default styles;