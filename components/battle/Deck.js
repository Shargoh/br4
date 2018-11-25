import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Image, TouchableOpacity } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import Dims from '../../utils/dimensions.js';
import { TEST_ANIM } from '../../constants/common.js';
import styles from './css.js';
import C from '../../engine/c.js';
import { b_deck } from '../../constants/images.js';

const w = Dims.widthPercent(4);

class Desk extends RefluxComponent {
	componentWillMount(){
		// this.bindStore('Battle');
		// this.setState({
		// 	can_reroll:this.store.get('state').can_reroll
		// });
	}
	render() {
		return (
			<TouchableOpacity style={styles.deck_box} onPress={() => {
				if(TEST_ANIM){
					BattleActions.event('test_enemy_animation');
				}
			}}>
				<Image style={styles.deck} source={C.getImage(b_deck)} />
			</TouchableOpacity>
    )
  }
}
  
export default Desk;