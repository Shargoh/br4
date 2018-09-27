import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import styles from './css';

class Info extends RefluxComponent {
	render() {
		var user_image;

		if(this.props.user){
			let shape = C.refs.ref('user_shape|'+this.props.user.shape);

			user_image = C.getImage(shape.thumb);
		}

		return (
			<ImageBackground style={styles.card} source={user_image}>
				<Text style={styles.text}>
					{this.props.user.timed.hp[0]}
				</Text>
			</ImageBackground>
		)
	}
}
  
export default Info;