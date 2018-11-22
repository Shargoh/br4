import React from 'react';
import C from '../engine/c.js';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component.js';
import Info from '../components/battle/Info';
import Reroll from '../components/battle/Reroll';
import Timer from '../components/battle/Timer';
import Surrender from '../components/battle/Surrender';
import Turns from '../components/battle/Turns.js';
import EnemyTurns from '../components/battle/EnemyTurns.js';
import Slots from '../components/battle/Slots';
import { View, ImageBackground, Image } from 'react-native';
import Desk from '../components/battle/Desk.js';
import { b_bg, b_flag_left, b_flag_right, b_field } from '../constants/images.js';
import Dims from '../utils/dimensions.js';
import { block_height, flags_margin } from '../components/battle/css';

const W = Dims.width(1),
	H = Dims.height(1),
	margin_top = Dims.battleMarginTop(),
	field_height = H + margin_top,
	// e_height = Dims.eHeight*H/field_height,
	left_flag_w = Dims.pixel(367),
	right_flag_h = Dims.pixel(2074),
	right_flag_w = Dims.pixel(373),
	field_bg_h = Dims.pixel(964),
	field_bg_w = Dims.pixel(1577);

// // посчитаем отступ флагов для узких экранов
// var width_k = H/Dims.eHeight,
// 	flags_margin = (W/width_k - Dims.eWidth)*width_k;

// flags_margin = Math.min(0,flags_margin);
// flags_margin = Math.max(-left_flag_w*0.6,flags_margin);

class LocationContainer extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.bindStore('User','user',this.onUserAction);
		this.setEnemy();
	}
	onAction(action,store){
		if(action == 'change' && store.changed.state){
			this.setEnemy();
		}
	}
	onUserAction(action,user){

	}
	setEnemy(){
		this.setState({
			enemy:this.store.getEnemy()
		});
	}
	/**
	 * тут везде независимое абсолютное позиционирование
	 */
  render() {
		return (
			<ImageBackground style={{
				// flexDirection: 'row',
				flex:1,
				width:'100%',
			}} source={C.getImage(b_bg)} resizeMode="cover">
				<Image style={{
					position:'absolute',
					left:flags_margin,
					top:0,
					height:H,
					width:left_flag_w
				}} source={C.getImage(b_flag_left)} />
				<Image style={{
					position:'absolute',
					right:flags_margin,
					top:0,
					height:right_flag_h,
					width:right_flag_w
				}} source={C.getImage(b_flag_right)} />
				<View style={{
					width:'100%',
					height:field_height,
					marginTop:-margin_top
				}}>
					<EnemyTurns />
					<View style={{
						alignItems:'center',
						justifyContent:'center',
						position:'absolute',
						top:block_height,
						height:field_bg_h*2,
						width:'100%'
					}}>
						<Image style={{
							height:field_bg_h,
							width:field_bg_w
						}} source={C.getImage(b_field)} />
						<Image style={{
							height:field_bg_h,
							width:field_bg_w,
							transform:[{rotateX:'180deg'}]
						}} source={C.getImage(b_field)} />
					</View>
					<View style={{
						flexDirection: 'row',
						flex:1,
						alignItems:'center',
						justifyContent:'center',
					}}>
						<Info user={this.state.enemy} enemy={true} />
					</View>
					<Slots enemy={true} slots={this.store.get('slots').slots[2] || {}} />
					<Slots enemy={false} slots={this.store.get('slots').slots[1] || {}} />
					<Timer />
					<Surrender />
					<Reroll />
					<Turns />
					<Desk />
					<View style={{
						flexDirection: 'row',
						flex:1,
						alignItems:'center',
						justifyContent:'center',
					}}>
						<Info user={this.user.attributes} enemy={false} />
					</View>
				</View>
			</ImageBackground>
		)
  }
}

export default LocationContainer;