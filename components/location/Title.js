import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { ImageBackground, Image, View, Text, TouchableOpacity } from 'react-native';
import { LocationActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles from './css';
import { l_title_bg, l_guild, l_goblet } from '../../constants/images.js';

class Title extends RefluxComponent {
	componentWillMount(){
		this.bindStore('User');
		this.setState(this.store.attributes);
	}
	render(){
		return (
			<ImageBackground style={styles.title_container} source={C.getImage(l_title_bg)}>
				<TouchableOpacity style={[styles.title_guild,styles.title_guild_icon]} onPress={() => {
					console.log('GUILD');
				}}>
					<Image source={C.getImage(l_guild)} style={styles.title_guild_icon}/>
				</TouchableOpacity>
				<View style={styles.title_nick_container}>
					<Text style={styles.title_nick_shadow}>{this.state.display_title}</Text>
					<Text style={styles.title_nick}>{this.state.display_title}</Text>
					<Text style={styles.title_guild_name}>Test</Text>
				</View>
				<Image source={C.getImage(l_goblet)} style={styles.title_goblet} />
				<Text style={styles.title_trophy_shadow}>{this.state.hoard.trophy}</Text>
				<Text style={styles.title_trophy}>{this.state.hoard.trophy}</Text>
			</ImageBackground>
		)
	}
}

export default Title;