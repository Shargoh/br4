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

const COUNT = 2;

class LocationContainer extends RefluxComponent {
	componentWillMount(){
		this.bindService('location');
		this.updateServiceState();
		this.setState({
			active_menu:0
		});
	}
	onAction(action,data){
		if(action == 'menubutton' && this.state.active_menu != data.index){
			this.setState({
				active_menu:data.index
			});

			if(data.by_button){
				this.refs.swiper.scrollBy(data.by_button);
			}
		}
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
					<MenuButton title="Монстры" bcount={COUNT} index={0} active={this.state.active_menu} />
					<MenuButton title="Рюкзак" bcount={COUNT} index={1} active={this.state.active_menu} />
				</View>
			</View>
		)
  }
}

export default LocationContainer;