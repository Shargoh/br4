import React from 'react';
import StuffComponent from '../proto_component';
import { Text, View, Image } from 'react-native';
import Dims from '../../../utils/dimensions';
import C from '../../c';

const W = Dims.width(15);

class TextStuff extends StuffComponent {
	render(){
		var config = this.props.config,
			proto = this.props.proto;

		return (
			<View style={{
				flexDirection:'row',
				justifyContent:'center',
				flex:1
			}}>
				<Image source={C.getImage(proto.image)} style={{
					width:W,
					height:W
				}}/>
				<Text style={{
					fontSize:21
				}}>{config.params.quantity}</Text>
			</View>
		)
	}
}

export default TextStuff;