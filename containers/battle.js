import React from 'react';
import C from '../engine/c.js';
import CSS from '../css/main.js';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component.js';
import Damage from '../components/battle/Damage';
import EnemyPreps from '../components/battle/EnemyPreps';
import Info from '../components/battle/Info';
import LostSteps from '../components/battle/LostSteps';
import ManaBar from '../components/battle/ManaBar';
import Preps from '../components/battle/Preps';
import Reroll from '../components/battle/Reroll';
import Timer from '../components/battle/Timer';
import Turn from '../components/battle/Turn';
import Groups from '../components/battle/Groups';
import { View } from 'react-native';
import SideMenu from 'react-native-side-menu';
import AnimationBox from '../components/battle/AnimationBox';

class LocationContainer extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.bindStore('User','user',this.onUserAction);
		this.setEnemy();
	}
	onAction(action,store){
		if(action == 'change' && store.changed.state){
			this.setEnemy();
		}
	}
	onUserAction(action,user){

	}
	setEnemy(){
		this.setState({
			enemy:this.store.getEnemy()
		});
	}
  render() {
		const menu = <Groups />;

		return (
			<SideMenu menu={menu}>
				<View style={{
						// flexDirection: 'row',
						flex: 1,
						width:'100%',
						backgroundColor:'white'
					}}>
					<Info user={this.state.enemy} />
					<EnemyPreps user={this.state.enemy} />
					<View style={{
						flex:1,
						justifyContent:'space-around',
						flexDirection:'row'
					}}>
						<Timer />
						<Turn />
						<Reroll />
					</View>
					<View style={{
						// flex:1,
						justifyContent:'center',
						alignItems:'center',
						flexDirection:'row'
					}}>
						{/* <LostSteps /> */}
						<Damage />
					</View>
					<Preps />
					<ManaBar />
					<Info user={this.user.attributes} />
				</View>
				<AnimationBox />
			</SideMenu>
		)
  }
}

export default LocationContainer;