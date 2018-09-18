import React from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Dims from '../../utils/dimensions.js';
import C from '../../engine/c.js';
import Timer from '../common/Timer.js';
import { ShopActions } from '../../engine/actions.js';

const k = 170/97,
	W = Dims.width(3);

class Main extends React.Component {
  render() {
		var timer;

		if(this.props.deal.ended){
			timer = (
				<Timer textStyle={{
					fontSize:24,
					color:'white'
				}} time={this.props.deal.ended} />
			)
		}

		return (
			<TouchableOpacity 
				style={{
					width:W,
					height:W/k
				}}
				onPress={() => {
					ShopActions.event('deal',this.props.deal);
				}}
			>
				<ImageBackground 
					style={{
						flex:1
					}} 
					resizeMode={'contain'} 
					source={C.getImage(this.props.deal.params.image)}
				>
					{timer}
				</ImageBackground>
			</TouchableOpacity>
    )
  }
}
  
export default Main;