import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { ImageBackground, Image, View, Text, TouchableOpacity } from 'react-native';
import { LocationActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import Dims from '../../utils/dimensions.js';
import Currency from './Currency';
import Title from './Title';
import TopMenu from './TopMenu';
import styles from './css';
import { l_chest_bg, l_chest_slot, l_chest_timer, l_chest_ruby } from '../../constants/images.js';
import Timer from '../common/Timer.js';
import { l_chest_open_text } from '../../constants/translates.js';

class Header extends RefluxComponent {
	render(){
		var data = this.props.data;

		if(data.active){
			return (
				<ImageBackground source={C.getImage(l_chest_bg)} style={styles.chest_container}>
					<Image source={data.img} style={[styles.chest_container,styles.chest]} />
					<ImageBackground source={C.getImage(l_chest_timer)} style={[
						styles.chest_container,
						styles.chest
					]}>
						<Timer textStyle={styles.chest_timer_text} time={data.left} options={{
							type:'short'
						}} />
					</ImageBackground>
					<Text style={styles.chest_open_text}>{l_chest_open_text.ru}</Text>
					<Image style={styles.chest_ruby} source={C.getImage(l_chest_ruby)} />
					<View style={styles.chest_ruby_container}>
						<Text style={styles.chest_ruby_count_shadow}>{data.cost}</Text>
						<Text style={styles.chest_ruby_count}>{data.cost}</Text>
					</View>
				</ImageBackground>
			)
		}else{
			return (
				<Image source={C.getImage(l_chest_slot)} style={styles.chest_container} />
			)
		}
		return (
			<View style={styles.header}>
				<Image source={C.getImage(l_header)} style={styles.header_bg} />
				<Currency name={'gold'} />
				<Currency name={'crystal'} />
				<TouchableOpacity style={[styles.settings,styles.settings_container]} onPress={() => {
					console.log('SETTINGS');
				}}>
					<Image source={C.getImage(l_settings_btn)} style={styles.settings} />
				</TouchableOpacity>
				<Title />
				<View style={styles.top_menu}>
					{menu.map((el) => {
						return <TopMenu data={el} key={el.name}/>;
					})}
				</View>
			</View>
		)
	}
}

export default Header;