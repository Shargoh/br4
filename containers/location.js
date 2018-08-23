import React from 'react';
import C from '../engine/c.js';
import CSS from '../css/main.js';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component.js';
import Surging from '../components/surging/List.js';
import Inventory from './inventory';
import MenuButton from '../components/common/MenuButton';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';
import Swiper from 'react-native-swiper';
import GlobalActions from '../engine/actions.js';

class LocationContainer extends RefluxComponent {
	componentWillMount(){
		this.bindService('location');
		this.updateServiceState();
		this.setState({
			active_menu:0
		});
	}
	onAction(action,active_menu){
		// if(action == 'menubutton' && this.state.active_menu != active_menu){
		// 	this.refs.swiper.scrollBy(active_menu);
		// }
	}
  render() {
		return (
			<View style={{
				width:'100%',
				flex:1
			}}>
				<Swiper 
					ref={'swiper'}
					loop={false} 
					showsPagination={false}
					onMomentumScrollEnd={(e,state) => {
						GlobalActions.event('toggle_menu',state.index);
					}}
				>
					<Surging />
					<Inventory />
				</Swiper>
				<View style={{
					width:'100%',
					height:50,
					justifyContent:'space-around',
					flexDirection:'row'
				}}>
					<MenuButton title="Монстры" index={0} active={this.state.active_menu} />
					<MenuButton title="Рюкзак" index={1} active={this.state.active_menu} />
				</View>
			</View>
		)
  }
}

export default LocationContainer;