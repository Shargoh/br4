import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { ScrollView, Text, View } from 'react-native';
import Info from './Info';

class Groups extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setTeams();
	}
	onAction(action,store){
		if(action == 'change' && store.changed.list){
			this.setTeams();
		}
	}
	setTeams(){
		var user_side = this.store.get('state').side,
			allies = [],
			enemies = [],
			list = this.store.get('list'),
			i = list.length;

		while(i--){
			let member = list[i];

			if(member.battle.side == user_side){
				allies.push(member);
			}else{
				enemies.push(member);
			}
		}

		this.setState({
			allies:allies,
			enemies:enemies
		});
	}
	render() {
		return (
			<ScrollView contentContainerStyle={{
				justifyContent:'flex-start',
				borderWidth:1,
				borderColor:'#000',
				backgroundColor:'#fff',
				height:'100%'
			}}>
				{
					this.state.allies.map((item,index) => (
						<View key={index} style={{
							backgroundColor:'lime',
							height:140,
							borderWidth:1,
							borderColor:'black',
							justifyContent:'center'
						}}>
							<Info user={item} />
						</View>
					))
				}
				{
					this.state.enemies.map((item,index) => (
						<View key={index} style={{
							backgroundColor:'#F59191',
							height:140,
							borderWidth:1,
							borderColor:'black',
							justifyContent:'center'
						}}>
							<Info user={item} />
						</View>
					))
				}
			</ScrollView>
    )
  }
}

export default Groups;