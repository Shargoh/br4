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
		var user_image, user_data_cmp;

		if(this.props.user){
			let shape = C.refs.ref('user_shape|'+this.props.user.shape);

			user_image = <Image style={{
				borderWidth:1,
				borderColor:'red',
				height:100,
				width:100
			}} source={C.getImage(shape.thumb)} />
	
			user_data_cmp = <View style={{
				flex:1,
				alignItems:'center',
			}}>
				<Text style={styles.text}>{this.props.user.display_title}</Text>
				<Text style={styles.text}>Здоровье:{this.props.user.timed.hp[0]}/{this.props.user.timed.hp[1]}</Text>
				<Text style={styles.text}>Щит:{this.props.user.timed.shield[0]}/{this.props.user.timed.shield[1]}</Text>
			</View>
		}else{
			user_data_cmp = <TouchableOpacity onPress={() => {
				GlobalActions.log(C.getStore('Battle').get('list').length);
			}}><Text>Console log</Text></TouchableOpacity>
		}

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
				{user_image}
				{user_data_cmp}
			</View>
		)
	}
}
  
export default Info;