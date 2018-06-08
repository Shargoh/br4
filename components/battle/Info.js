import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';

class Info extends RefluxComponent {
	render() {
		return (
			<View style={{
					height:'18%',
					margin:5,
					flex:1,
					borderWidth: 1,
					borderColor: '#000',
					alignItems: 'center',
    			justifyContent: 'center'
				}}>
				<Text>{this.props.user.display_title}</Text>
				<Text>{this.props.user.timed.hp[0]}/{this.props.user.timed.hp[1]}</Text>
			</View>
    )
  }
}
  
export default Info;