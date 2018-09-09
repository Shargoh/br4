// var _ = require("lodash"),
// 	C = require("C"),
// 	React = require("react"),
// 	Mixin = require("engine/stuff/mixin"),
// 	RDOM = require("reactDom"),
// 	Dialog = require("dialog/item"),
// 	DateUtils = require("engine/utils/date"),
// 	Factory = require("engine/factory"),
// 	GlobalActions = require("engine/actions"),

import React from 'react';
import StuffComponent from '../proto_component';
import { View, ImageBackground } from 'react-native';
import C from '../../c';

class ImageStuff extends StuffComponent {
	componentWillMount(){
		this.decorators = [];
	}
	render(){
		var decorators = this.getDecorators(),
			config = this.props.config,
			proto = this.props.proto;

		return (
			<View style={{flex:1}}>
				{decorators[0]}
				<ImageBackground key={'itemimage'+config.params.id} style={{
					flex:1,
					justifyContent:'center'
				}} source={C.getImage(proto.image_big)} resizeMode="contain">
					{decorators[1]}
				</ImageBackground>
			</View>
		)
	}
}

export default ImageStuff;