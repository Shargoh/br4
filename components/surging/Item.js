import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';

class AccountList extends RefluxComponent {
	render() {
		return (
			<View style={CSS.listitem}>
				<Text>{this.props.item.label}</Text>
				<Text>Power: {this.props.item.bot_power}</Text>
				<Button
					onPress={() => {
						GlobalActions.event('attack_bot',this.props.item);
					}}
					title="Attack"
					color="#ff0000"
				/>
				<Button
					onPress={() => {
						GlobalActions.event('banish_bot',this.props.item);
					}}
					title="Banish"
					color="#0000ff"
				/>
			</View>
    )
  }
}
  
export default AccountList;