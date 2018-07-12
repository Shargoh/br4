import React from 'react';
import CSS from '../../css/main.js';
import EmailInput from '../fields/Email.js';
import PasswordInput from '../fields/Password.js';
import { Text, View, TouchableOpacity } from 'react-native';
import RefluxComponent from '../../engine/views/reflux_component.js';
import GlobalActions from '../../engine/actions.js';

class AddAccount extends RefluxComponent {
	validate() {
		if(!this.state) return false;
		if(!this.state.email) return false;
		if(!this.state.password) return false;
		
		return true;
	}
  render() {
		var button;

		if(this.validate()){
			button = (
				<TouchableOpacity style={CSS.bottom_button} onPress={() => {
					GlobalActions.event('add_account',{
						email:this.state.email,
						password:this.state.password
					});
				}}>
					<Text style={CSS.bottom_button_text}>
						Добавить
					</Text>
				</TouchableOpacity>
			)
		}else{
			button = (
				<TouchableOpacity style={CSS.bottom_button} onPress={() => {
					GlobalActions.state(2);
				}}>
					<Text style={CSS.bottom_button_text}>
						Назад
					</Text>
				</TouchableOpacity>
			)
		}

		return (
      <View style={{
				flex:1,
				width:'100%'
			}}>
				<View style={{
					alignItems: 'center',
					justifyContent: 'center',
					flex:1,
				}}>
					<EmailInput 
						onChangeEmail={(text) => {
							this.setState({
								email:text
							});
						}}
					/>
					<PasswordInput
						onChangePassword={(text) => {
							this.setState({
								password:text
							});
						}}
					/>
				</View>
				{button}
      </View>
    )
  }
}
  
export default AddAccount;