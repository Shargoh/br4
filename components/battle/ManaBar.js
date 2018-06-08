import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';

class ManaBar extends RefluxComponent {
	componentWillMount(){
		this.bindStore('User');
		this.setState({
			mp:this.store.get('timed').mp
		});
	}
	onAction(action,store){
		if(action == 'change' && store.changed.timed){
			this.setState({
				mp:store.changed.timed.mp
			});
		}
	}
	render() {
		return (
			<View style={{
				justifyContent:'center',
				alignItems:'center'
			}}>
				<Text>{this.state.mp[0]}/{this.state.mp[1]}</Text>
			</View>
    )
  }
}
  
export default ManaBar;