import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';
import ListItem from './ListItem';

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
					style={{
						marginTop:70
					}}
					data={this.state.accounts}
					renderItem={({item}) => (
						<ListItem item={item} />
					)}
					keyExtractor={(item, index) => 'account'+index}
				/>
				<TouchableOpacity style={CSS.bottom_button} onPress={() => {
					GlobalActions.state(1);
				}}>
					<Text style={CSS.bottom_button_text}>
						Добавить аккаунт
					</Text>
				</TouchableOpacity>
			</View>
    )
  }
}
  
export default AccountList;