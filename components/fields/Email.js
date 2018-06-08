import React from 'react';
import CSS from '../../css/main.js';
import { TextInput } from 'react-native';

class EmailInput extends React.Component {
  render() {
    return (
      <TextInput
				style={CSS.input}
				autoCapitalize='none'
				placeholder='E-mail'
				onChangeText={(text) => {
					if(this.props.onChangeEmail){
						this.props.onChangeEmail(text);
					}
				}}
			/>
    )
  }
}

function validate(text){
	return true;
}
  
export default EmailInput;