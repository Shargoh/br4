import React from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Dims from '../../utils/dimensions.js';
import C from '../../engine/c';
import Timer from '../common/Timer';
import { ShopActions } from '../../engine/actions.js';

const k = 480/240,
	W = Dims.width(1);

class Main extends React.Component {
  render() {
		if(!this.props.deal) return null;

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
					source={C.getImage(this.props.deal.params.image2)}
				>
					<Timer textStyle={{
						fontSize:24,
						color:'white'
					}} time={this.props.deal.ended} />
				</ImageBackground>
			</TouchableOpacity>
    )
  }
}
  
export default Main;