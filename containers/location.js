import React from 'react';
import C from '../engine/c.js';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component.js';
import Surging from '../components/surging/List.js';
import Inventory from './inventory';
import Shop from './shop';
import { Image, Text, View, Button, Alert, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import SwiperFlatList from 'react-native-swiper-flatlist';
import GlobalActions from '../engine/actions.js';
import Header from '../components/location/Header.js';
import { l_bg, l_arena_preview_bg, l_footer } from '../constants/images.js';
import Dims from '../utils/dimensions.js';
import Chests from '../components/location/Chests.js';
import ArenaPreview from '../components/location/ArenaPreview.js';
import styles from '../components/location/css.js';
import Menu from '../components/location/Menu.js';

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
				this.refs.swiper.scrollToIndex(data.index);
			}
		}
	}
  render() {
		// var swiper = (
		// 	<Swiper 
		// 		ref={'swiper'}
		// 		loop={false} 
		// 		// showsPagination={false}
		// 		containerStyle={styles.swiper_container}
		// 		// onMomentumScrollEnd={(e,state) => {
		// 		// 	GlobalActions.event('toggle_menu',state.index);
		// 		// }}
		// 	>
		// 		<ArenaPreview data={{
		// 			img:C.getImage(l_arena_preview_bg),
		// 			left:100*60*100,
		// 			title:'ЗОЛОТАЯ ЛИГА',
		// 			num:10,
		// 			place:36
		// 		}} />
		// 		<Surging />
		// 		<Inventory />
		// 		<Shop />
		// 	</Swiper>
		// )

		var ServiceManager = C.getManager('service');

		// console.log(this.state.location.blob.objects)

		var swiper = (
			<SwiperFlatList 
				contentContainerStyle={{
					top:Dims.pixel(1040)
				}}
				ref={'swiper'}
				onMomentumScrollEnd={(data) => {
					GlobalActions.event('toggle_menu',data.index);
				}}
				children={this.state.location.blob.objects.map((data) => {
					if(!data.client_action.id) return null;

					var service = ServiceManager.getById(data.client_action.id);

					if(!service) return null;

					switch(service.info.proto.package){
						case 'surging':
							return <Surging />;
						case 'inventory':
							return <Inventory />
						case 'shop':
							return <Shop />
						case 'mobile_arena':
							return <ArenaPreview service={service} />
						default:
							return null;
					}

					// console.log(service);

					return (
						<Text>{data.client_action.id}</Text>
					)
				})}
				// onScrollBeginDrag={(e) => {
				// 	// console.log(Object.keys(e.currentTarget))
				// 	console.log(e.currentTarget)
				// 	// GlobalActions.event('toggle_menu',data.index);
				// }}
			>
				{/* <ArenaPreview data={{
					img:C.getImage(l_arena_preview_bg),
					left:100*60*100,
					title:'ЗОЛОТАЯ ЛИГА',
					num:10,
					place:36
				}} />
				<Surging />
				<Inventory />
				<Shop /> */}
			</SwiperFlatList>
		)

		return (
			<ImageBackground style={{
				// flexDirection: 'row',
				flex:1,
				width:Dims.width(1),
				alignItems:'center'
			}} source={C.getImage(l_bg)} resizeMode="cover">
				<Header />
				<Chests />
				{swiper}
				<Menu menus={this.state.location.blob.objects.map((data) => {
					return {title:data.description};
				})} active_menu={this.state.active_menu} />
			</ImageBackground>
		)
  }
}

export default LocationContainer;