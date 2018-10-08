import React from 'react';
import C from '../engine/c.js';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component.js';
import Info from '../components/battle/Info';
import Reroll from '../components/battle/Reroll';
import Timer from '../components/battle/Timer';
import Surrender from '../components/battle/Surrender';
import Turns from '../components/battle/Turns.js';
import EnemyTurns from '../components/battle/EnemyTurns.js';
import Slots from '../components/battle/Slots';
import { View } from 'react-native';
import Desk from '../components/battle/Desk.js';

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
		return (
			<View style={{
				// flexDirection: 'row',
				flex:1,
				width:'100%',
				backgroundColor:'white'
			}}>
				<View style={{
					flexDirection: 'row',
					flex:1,
					alignItems:'center',
					justifyContent:'center',
				}}>
					<Info user={this.state.enemy} />
				</View>
				<EnemyTurns />
				<Slots enemy={true} slots={this.store.get('slots').slots[2] || {}} />
				<Slots enemy={false} slots={this.store.get('slots').slots[1] || {}} />
				<Timer />
				<Surrender />
				<Reroll />
				<Turns />
				<Desk />
				<View style={{
					flexDirection: 'row',
					flex:1,
					alignItems:'center',
					justifyContent:'center',
				}}>
					<Info user={this.user.attributes} />
				</View>
			</View>
		)
  }
}

export default LocationContainer;