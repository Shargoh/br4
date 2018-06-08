import React from 'react';
import CSS from '../../css/main.js';
import { TextInput } from 'react-native';

class PasswordInput extends React.Component {
  render() {
    return (
      <TextInput
				style={CSS.input}
				autoCapitalize='none'
        placeholder='Password'
        onChangeText={(text) => {
					if(this.props.onChangePassword){
						this.props.onChangePassword(text);
					}
				}}
			/>
    )
  }
}
  
export default PasswordInput;