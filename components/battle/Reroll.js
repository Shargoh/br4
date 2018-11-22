import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Image, ImageBackground, TouchableOpacity } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import Dims from '../../utils/dimensions.js';
import C from '../../engine/c';
import styles from './css.js';
import { b_reroll, b_reroll_bg } from '../../constants/images.js';

const w = Dims.widthPercent(4);

class Info extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setState({
			can_reroll:this.store.canReroll()
		});
	}
	onAction(action,store){
		if(
			(action == 'change' && store.changed.state) ||
			action == 'reroll'
		){
			this.setState({
				can_reroll:store.canReroll()
			});
		}else if(action == 'before_reroll'){
			this.setState({
				can_reroll:false
			});
		}
	}
	render() {
		return (
			<ImageBackground style={styles.reroll_box} source={C.getImage(b_reroll_bg)}>
				<TouchableOpacity onPress={() => {
					if(this.state.can_reroll){
						BattleActions.reroll();
					}
				}}>
					<Image style={[styles.surrender_btn,{
						marginLeft:Dims.pixel(98),
						marginTop:Dims.pixel(125)
					}]} source={C.getImage(b_reroll)} />
				</TouchableOpacity>
			</ImageBackground>
    )
  }
}
  
export default Info;