import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, View, Button, Image, StyleSheet } from 'react-native';
import GlobalActions from '../../engine/actions.js';

const styles = StyleSheet.create({
  text:{
    fontSize:24,
  }
});

class AccountList extends RefluxComponent {
	render() {
		var shape = C.refs.ref('user_shape|'+this.props.item.shape)

		return (
			<View style={{
				padding:20,
				alignItems:'center',
				justifyContent:'space-between',
				flexDirection:'row'
			}}>
				<Image style={{
					borderWidth:1,
					borderColor:'red',
					height:100,
					width:100
				}} source={C.getImage(shape.thumb)} />
				<View style={{
					justifyContent:'space-between',
				}}>
					<View>
						<Text style={styles.text}>{this.props.item.label}</Text>
						<Text style={styles.text}>Power: {this.props.item.bot_power}</Text>
					</View>
					<View style={{
						alignItems:'center',
						justifyContent:'center',
						flexDirection:'row'
					}}>
						<Button
							onPress={() => {
								GlobalActions.event('attack_bot',this.props.item);
							}}
							title="Напасть"
							color="#ff0000"
						/>
						<Button
							onPress={() => {
								GlobalActions.event('banish_bot',this.props.item);
							}}
							title="Изгнать"
							color="#0000ff"
						/>
					</View>
				</View>
			</View>
    )
  }
}
  
export default AccountList;