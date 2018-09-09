import React from 'react';
import StuffComponent from '../proto_component';
import { Text } from 'react-native';

class TextStuff extends StuffComponent {
	render(){
		var proto = this.props.proto;

		return (
			<Text>{proto.title}</Text>
		)
	}
}

export default TextStuff;