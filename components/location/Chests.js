import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Image, View, Text, TouchableOpacity } from 'react-native';
import { LocationActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import Chest from './Chest';
import styles from './css';
import { l_chest } from '../../constants/images.js';

const chests = [{
	// img:C.getImage(l_chest),
	name:'first'
},{
	img:C.getImage(l_chest),
	name:'second',
	active:true,
	left:100*60*20,
	cost:20
},{
	img:C.getImage(l_chest),
	name:'third',
	active:true,
	left:12*60*2,
	cost:3
}];

class Chests extends RefluxComponent {
	render(){
		return (
			<View style={styles.chests_container}>
				{chests.map((el) => {
					return <Chest data={el} key={el.name} />;
				})}
			</View>
		)
	}
}

export default Chests;