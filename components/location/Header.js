import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Image, View, Text, TouchableOpacity } from 'react-native';
import { LocationActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import Dims from '../../utils/dimensions.js';
import Currency from './Currency';
import Title from './Title';
import TopMenu from './TopMenu';
import styles from './css';
import { 
	l_settings_btn, 
	l_m_cards, 
	l_m_mail, 
	l_m_shop, 
	l_m_coins, 
	l_m_helmet, 
	l_header
} from '../../constants/images.js';

const menu = [{
	img:C.getImage(l_m_cards),
	name:'cards'
},{
	img:C.getImage(l_m_mail),
	name:'mail'
},{
	img:C.getImage(l_m_shop),
	name:'shop'
},{
	img:C.getImage(l_m_coins),
	name:'coins'
},{
	img:C.getImage(l_m_helmet),
	name:'helmet'
}];

class Header extends RefluxComponent {
	render(){
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