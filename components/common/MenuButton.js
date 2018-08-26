import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, View, Button, Image, StyleSheet } from 'react-native';
import GlobalActions from '../../engine/actions.js';

class AccountList extends RefluxComponent {
	render() {
		var color;

		if(this.props.index == this.props.active){
			color = '#ff0000';
		}else{
			color = '#0000ff';
		}

		return (
			<Button
				style={{
					flex:1,
					flexDirection:'row'
				}}
				onPress={() => {
					GlobalActions.event('toggle_menu',this.props.index,true);
				}}
				title={this.props.title}
				color={color}
			/>
    )
  }
}
  
export default AccountList;