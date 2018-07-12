import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';

const styles = StyleSheet.create({
  text:{
    fontSize:24,
  }
});

class Info extends RefluxComponent {
	render() {
		if(this.props.user){
			var shape = C.refs.ref('user_shape|'+this.props.user.shape)

			return (
				<View style={{
					height:'18%',
					margin:5,
					flex:1,
					borderWidth:1,
					borderColor:'#000',
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
						flex:1,
						alignItems:'center',
					}}>
						<Text style={styles.text}>{this.props.user.display_title}</Text>
						<Text style={styles.text}>{this.props.user.timed.hp[0]}/{this.props.user.timed.hp[1]}</Text>
					</View>
				</View>
			)
		}else return null;
	}
}
  
export default Info;