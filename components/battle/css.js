import { StyleSheet } from 'react-native';
import Dims from '../../utils/dimensions.js';

/**
 * Посчитаем высоту и ширину карты
 */
const margin_top = Dims.battleMarginTop();

export const card_size = Dims.cardSize();
export const screen_width = Dims.width(1);
export const screen_height = Dims.height(1);
export const battle_height = screen_height + margin_top;
export const turn_block_width = card_size.w*3;
export const slots_block_width = card_size.w*5;
export const block_height = card_size.h;
export const info_height = Dims.pixel(490);
export const turn_margin = -card_size.w/6;

var width_k = screen_height/Dims.eHeight,
	_flags_margin = (screen_width/width_k - Dims.eWidth)*width_k,
	left_flag_w = Dims.pixel(367);

_flags_margin = Math.min(0,_flags_margin);
_flags_margin = Math.max(-left_flag_w*0.6,_flags_margin);

export const flags_margin = _flags_margin;

const sin45 = Math.sin(43*Math.PI/180);

const styles = StyleSheet.create({
  text:{
		fontSize:30,
		color:'lime'
	},
	card:{
		height:card_size.h,
		width:card_size.w,
		marginLeft:card_size.my,
		marginRight:card_size.my,
		alignItems:'center',
		justifyContent:'center'
	},
	card_size:{
		height:card_size.h,
		width:card_size.w,
	},
	turn:{
		height:card_size.h,
		width:card_size.w,
		marginLeft:turn_margin,
		marginRight:turn_margin,
		alignItems:'center',
		justifyContent:'center'
	},
	my_turn:{
		height:card_size.h,
		width:card_size.w,
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
		top:block_height*3 + info_height*2
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
		top:block_height + info_height
	},
	my_slots:{
		top:block_height*2 + info_height
	},
	dmg_bg:{
		position:'absolute',
		top:card_size.h/9.5,
		left:card_size.w/7.5,
		width:Dims.pixel(65),
		height:Dims.pixel(139),
		alignItems:'center'
	},
	hp_bg:{
		position:'absolute',
		bottom:card_size.h/11,
		right:card_size.w/5,
		height:Dims.pixel(58),
		flexDirection:'row',
		alignItems:'flex-end'
	},
	icon:{
		width:Dims.pixel(58),
		height:Dims.pixel(58),
		marginTop:Dims.pixel(5)
	},
	card_text:{
		fontFamily:'KenyanCoffeeRg-Bold',
		fontSize:Dims.pixel(50),
		color:'#fdf9bf',
		marginTop:Dims.height(-Dims.eHeight/10),
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: {width: Dims.pixel(5), height: Dims.pixel(5)},
		textShadowRadius: Dims.pixel(5)
	},
	wait_text:{
		fontFamily:'KenyanCoffeeRg-Bold',
		fontSize:Dims.pixel(160),
		color:'#b7b7b7',
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: {width: 1, height: 1},
		textShadowRadius: Dims.pixel(4),
	},
	hero:{
		width:info_height*sin45,
		height:info_height*sin45
	},
	avatar_size:{
		width:info_height,
		height:Dims.pixel(494),
	},
	avatar_box:{
		alignItems:'center',
		justifyContent:'center',
		position:'absolute'
	},
	enemy_avatar_box:{
		top:block_height
	},
	my_avatar_box:{
		top:block_height*3 + info_height
	},
	avatar_heart:{
		position:'absolute',
		top:Dims.pixel(350),
		width:Dims.pixel(162),
		height:Dims.pixel(98)
	},
	avatar_hp:{
		fontFamily:'KenyanCoffeeRg-Bold',
		fontSize:Dims.pixel(55),
		color:'#fdf9bf',
		textAlign:'center',
		textShadowColor: 'rgba(0, 0, 0, 0.5)',
		textShadowOffset: {width: Dims.pixel(5), height: Dims.pixel(5)},
		textShadowRadius: Dims.pixel(5)
	},
	timer_box:{
		justifyContent:'center',
		alignItems:'center',
		position:'absolute',
		top:margin_top + Dims.pixel(46),
		left:flags_margin + Dims.pixel(285),
		width:Dims.pixel(308),
		height:Dims.pixel(362)
	},
	timer_text:{
		fontFamily:'Gotham-Medium',
		color:'#fcf23d',
		fontSize:Dims.pixel(65),
		marginTop:Dims.pixel(50),
		textShadowColor: 'rgb(255, 0, 0)',
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: Dims.pixel(21)
	},
	surrender_box:{
		position:'absolute',
		top:margin_top - Dims.pixel(45),
		right:flags_margin + Dims.pixel(265),
		width:Dims.pixel(353),
		height:Dims.pixel(477),
		transform:[{rotate:'180deg'}]
	},
	reroll_box:{
		position:'absolute',
		bottom:Dims.pixel(50),
		left:flags_margin + Dims.pixel(265),
		width:Dims.pixel(353),
		height:Dims.pixel(477)
	},
	surrender_btn:{
		width:Dims.pixel(193),
		height:Dims.pixel(193),
		marginLeft:Dims.pixel(98),
		marginTop:Dims.pixel(125)
	},
	deck_box:{
		position:'absolute',
		bottom:Dims.pixel(0),
		right:flags_margin + Dims.pixel(265),
		width:Dims.pixel(383),
		height:Dims.pixel(559)
	},
	deck:{
		width:Dims.pixel(383),
		height:Dims.pixel(559)
	}
});

export default styles;