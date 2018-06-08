import React from 'react';
import CSS from '../../css/main.js';
import EmailInput from '../fields/Email.js';
import PasswordInput from '../fields/Password.js';
import { StyleSheet, Text, View, Button, Alert, TextInput, AsyncStorage } from 'react-native';
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
		return (
      <View style={CSS.container}>
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
				<Button
					onPress={() => {
						if(this.validate()){
							GlobalActions.event('add_account',{
								email:this.state.email,
								password:this.state.password
							});
						}
					}}
					title="Add account"
					color="#ff0000"
				/>
      </View>
    )
  }
}
  
export default AddAccount;