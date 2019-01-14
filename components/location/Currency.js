import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Image, View, Text, TouchableOpacity } from 'react-native';
import { LocationActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import Dims from '../../utils/dimensions.js';
import styles from './css';
import { l_coin, l_ruby, l_rbg } from '../../constants/images.js';
import CommonUtils from '../../engine/utils/common.js';

class Currency extends RefluxComponent {
	componentWillMount(){
		this.bindStore('User');

		var money  = this.store.get('money'),
			value = 0,
			img;

		if(money){
			value = money[this.props.name];
		}

		switch(this.props.name){
			case 'gold':
				img = l_coin;
				break;
			case 'crystal':
				img = l_ruby;
				break;
			default:
				break;
		}

		this.setState({
			value:value,
			img:img
		});
	}
	onAction(action,store){
		if(
			action == 'change' && 
			store.changed.money && 
			store.changed.money[this.props.name] !== undefined
		){
			this.setState({
				value:store.changed.money[this.props.name]
			});
		}
	}
	render(){
		return (
			<View style={[styles.resource_container,styles['resource_'+this.props.name]]}>
				<Image source={C.getImage(l_rbg)} style={styles.resource_bg} />
				<Image source={C.getImage(this.state.img)} style={styles.resource_img} />
				<Text style={styles.resource_text}>{CommonUtils.printNumber(this.state.value)}</Text>
				<TouchableOpacity style={styles.resource_plus_container} onPress={() => {
					console.log('PLUS');
				}}>
					<Text style={styles.resource_plus}>+</Text>
				</TouchableOpacity>
			</View>
		)
	}
}

export default Currency;