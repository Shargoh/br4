import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { ImageBackground, Image, View, Text, TouchableOpacity } from 'react-native';
import { LocationActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import Dims from '../../utils/dimensions.js';
import Currency from './Currency';
import styles from './css';
import { l_m_counter } from '../../constants/images.js';

class TopMenu extends RefluxComponent {
	render(){
		return (
			<ImageBackground style={styles.top_menu_el} source={this.props.data.img}>
				<ImageBackground style={styles.top_menu_counter} source={C.getImage(l_m_counter)}>
					<Text style={styles.top_menu_counter_text}>{Math.ceil(Math.random()*99)}</Text>
				</ImageBackground>
			</ImageBackground>
		)
	}
}

export default TopMenu;