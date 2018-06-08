import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';

class AccountList extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Accounts');
		this.setState(this.store.attributes);
	}
  render() {
		return (
			<View style={{
				flex:1,
				width:'100%',
			}}>
				<FlatList
					data={this.state.accounts}
					renderItem={({item}) => (
						<View style={CSS.listitem}>
							<TouchableOpacity onPress={() => {
								GlobalActions.event('enter_game',item);
							}}>
								<View>
									<Text>{item.email}</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {
								GlobalActions.event('delete_account',item);
							}}>
								<View>
									<Text>X</Text>
								</View>
							</TouchableOpacity>
						</View>
					)}
					keyExtractor={(item, index) => 'account'+index}
				/>
				<Button
					onPress={() => {
						GlobalActions.state(1);
					}}
					title="Add another account"
					color="#ff0000"
				/>
			</View>
    )
  }
}
  
export default AccountList;