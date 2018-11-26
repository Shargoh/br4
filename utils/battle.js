import React from 'react';
import C from '../engine/c';
import { Image, ImageBackground, Text } from 'react-native';
import { b_slot_bg_wait, b_timer } from '../constants/images';
import styles, { card_size, screen_width } from '../components/battle/css';
import { LinearTextGradient } from 'react-native-text-gradient';

const BattleUtils = {
	calcBotDelay(auras){
		var start_cd = 0;

		if(auras && auras.length){
			let i = auras.length,
				cd_auras = C.refs.ref('constants|cd_auras').value.split(',');

			while(i--){
				let aura = auras[i];

				if(cd_auras.indexOf(aura[0].toString()) != -1){
					start_cd = Math.max(start_cd,aura[1]);
				}
			}
		}

		return start_cd;
	},
	compileBotDelayCmp(auras){
		var start_cd = this.calcBotDelay(auras);

		if(start_cd){
			return (
				<ImageBackground style={[styles.card_size,{
					position:'absolute',
					marginTop:-1,
					marginLeft:-1,
					justifyContent:'center',
					alignItems:'center',
					flexDirection:'row'
				}]} source={C.getImage(b_slot_bg_wait)} resizeMode="contain">
					<Image style={styles.icon} source={C.getImage(b_timer)} resizeMode="contain" />
					<Text style={styles.wait_text}>{start_cd}</Text>
				</ImageBackground>
			)
		}
	},
	// slot 1-5
	calcSlotLeft(slot){
		return screen_width/2 + (slot - 3.5)*(card_size.w + card_size.my*2) + card_size.my
	},
	compileCardText(text){
		return (
			<LinearTextGradient
				style={styles.card_text}
				locations={[0, 1]}
				colors={['#ffffff', '#fdf9bf']}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
			>{text}</LinearTextGradient>
		)
	}
}

export default BattleUtils;