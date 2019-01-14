import React from 'react';
import C from '../engine/c.js';
import CSS from '../css/main.js';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component.js';
import Surging from '../components/surging/List.js';
import Inventory from './inventory';
import Shop from './shop';
import MenuButton from '../components/common/MenuButton';
import { Image, Text, View, Button, Alert, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import GlobalActions from '../engine/actions.js';
import Header from '../components/location/Header.js';
import { l_bg, l_arena_preview_bg } from '../constants/images.js';
import Dims from '../utils/dimensions.js';
import Chests from '../components/location/Chests.js';
import ArenaPreview from '../components/location/ArenaPreview.js';

const COUNT = 4;

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
			<ImageBackground style={{
				// flexDirection: 'row',
				flex:1,
				width:Dims.width(1),
			}} source={C.getImage(l_bg)} resizeMode="cover">
				<Header />
				<Chests />
				<Swiper 
					ref={'swiper'}
					loop={false} 
					showsPagination={false}
					onMomentumScrollEnd={(e,state) => {
						GlobalActions.event('toggle_menu',state.index);
					}}
				>
					<ArenaPreview data={{
						img:C.getImage(l_arena_preview_bg),
						left:100*60*100,
						title:'ЗОЛОТАЯ ЛИГА',
						num:10,
						place:36
					}} />
					<Surging />
					<Inventory />
					<Shop />
				</Swiper>
				<View style={{
					width:'100%',
					height:50,
					justifyContent:'space-around',
					flexDirection:'row'
				}}>
					<MenuButton title="Арена" bcount={COUNT} index={0} active={this.state.active_menu} />
					<MenuButton title="Монстры" bcount={COUNT} index={1} active={this.state.active_menu} />
					<MenuButton title="Рюкзак" bcount={COUNT} index={2} active={this.state.active_menu} />
					<MenuButton title="Магазин" bcount={COUNT} index={3} active={this.state.active_menu} />
				</View>
			</ImageBackground>
		)
  }
}

export default LocationContainer;