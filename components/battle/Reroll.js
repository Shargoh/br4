import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, TouchableOpacity } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import Dims from '../../utils/dimensions.js';

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
			<TouchableOpacity style={{
				justifyContent:'center',
				alignItems:'center',
				borderWidth:1,
				borderColor:'#000',
				borderRadius:w,
				position:'absolute',
				bottom:w,
				left:w,
				width:w*6,
				backgroundColor:this.state.can_reroll ? 'lime' : 'red'
			}} onPress={() => {
				if(this.state.can_reroll){
					BattleActions.reroll();
				}
			}}>
				<Text style={{
					fontSize:24
				}}>Reroll</Text>
			</TouchableOpacity>
    )
  }
}
  
export default Info;