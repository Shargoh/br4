import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { ScrollView, FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';

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
				justifyContent:'space-around',
				borderWidth:1,
				borderColor:'#000',
				backgroundColor:'#ccc'
			}}>
				{
					this.state.allies.map((item,index) => (
						<View key={index} style={{
							flex:1,
							height:100,
							borderWidth:1,
							borderColor:'black',
							justifyContent:'center',
							margin:5
						}}>
							<Text>{item.display_title}</Text>
							<Text>{item.timed.hp[0]}/{item.timed.hp[1]}</Text>
							<Text>{item.timed.mp[0]}/{item.timed.mp[1]}</Text>
						</View>
					))
				}
				{
					this.state.enemies.map((item,index) => (
						<View key={index} style={{
							flex:1,
							height:100,
							borderWidth:1,
							borderColor:'black',
							justifyContent:'center',
							margin:5
						}}>
							<Text>{item.display_title}</Text>
							<Text>{item.timed.hp[0]}/{item.timed.hp[1]}</Text>
							<Text>{item.timed.mp[0]}/{item.timed.mp[1]}</Text>
						</View>
					))
				}
			</ScrollView>
    )
  }
}
  
export default Groups;