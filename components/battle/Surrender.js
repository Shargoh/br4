import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { TouchableOpacity, Image, ImageBackground } from 'react-native';
import DateUtils from '../../engine/utils/date.js';
import Dims from '../../utils/dimensions.js';
import GlobalActions, { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c';
import styles from './css.js';
import { b_surrender, b_reroll_bg } from '../../constants/images.js';

const w = Dims.widthPercent(4);

class BattleTimer extends RefluxComponent {
	render() {
		return (
			<ImageBackground style={[styles.surrender_box,{
				transform:[{rotate:'180deg'}]
			}]} source={C.getImage(b_reroll_bg)}>
				<TouchableOpacity onPress={() => {
					GlobalActions.log('Surrender!');
					BattleActions.prep(C.refs.ref('constants|prep_defeat').value);
				}}>
					<Image style={[styles.surrender_btn,{
						transform:[{rotate:'180deg'}],
						marginLeft:Dims.pixel(98),
						marginTop:Dims.pixel(125)
					}]} source={C.getImage(b_surrender)} />
				</TouchableOpacity>
			</ImageBackground>
    )
  }
}
  
export default BattleTimer;