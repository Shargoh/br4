import React from 'react';
import { ImageBackground, Image, View, Text, TouchableOpacity } from 'react-native';
import { LocationActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles from './css';
import { l_m_counter } from '../../constants/images.js';

class TopMenu extends React.Component {
	render(){
		return (
			<TouchableOpacity style={styles.top_menu_el} onPress={() => {
				LocationActions.event('menu',this,this.props.data);
			}}>
				<ImageBackground style={styles.top_menu_inside} source={C.getImage(this.props.data.images.image)}>
					<ImageBackground style={styles.top_menu_counter} source={C.getImage(l_m_counter)}>
						<Text style={styles.top_menu_counter_text}>{Math.ceil(Math.random()*99)}</Text>
					</ImageBackground>
				</ImageBackground>
			</TouchableOpacity>
		)
	}
}

export default TopMenu;