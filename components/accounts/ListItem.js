import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity, StyleSheet } from 'react-native';
import GlobalActions from '../../engine/actions.js';

const styles = StyleSheet.create({
  text: {
		fontSize:21,
		marginLeft:25,
		marginRight:25
  }
});

class AccountList extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Accounts');
		this.setState(this.store.attributes);
	}
  render() {
		var item = this.props.item;

		return (
			<View style={{
				padding:20,
				alignItems:'center',
				justifyContent:'space-between',
				flexDirection:'row'
			}}>
				<TouchableOpacity style={{
					flex:1,
				}} onPress={() => {
					GlobalActions.event('enter_game',item);
				}}>
					<Text style={styles.text}>{item.email}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => {
					GlobalActions.event('delete_account',item);
				}}>
					<Text style={styles.text}>X</Text>
				</TouchableOpacity>
			</View>
    )
  }
}
  
export default AccountList;