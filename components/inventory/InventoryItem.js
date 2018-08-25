import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Button } from 'react-native';
import GlobalActions from '../../engine/actions.js';
import C from '../../engine/c.js';

const styles = StyleSheet.create({
  item: {
    flex:1,
		justifyContent:'center',
		margin:5,
		width:100,
		height:100
	},
	inside: {
		flex:1,
		justifyContent:'center',
	},
	buttons:{
		position:'absolute',
		top:50,
		width:'100%'
	},
	button:{
		fontSize:10
	}
});

class Inventory extends RefluxComponent {
	componentWillMount(){
		this.setState({
			visible:false
		});
	}
	compileItem(){
		var item = this.props.item;
		
		return {
			type:'item',
			params:{
				quantity:item.param.count || 1,
				id:item.proto_id
			},
			items_params:item
		};
	}
	toggleDetails(){
		var visible = this.state && this.state.visible;

		this.setState({
			visible:!visible
		});
	}
  render() {
		var buttons;

		if(this.state.visible){
			buttons = (
				<View style={styles.buttons}>
					<Button
						style={styles.button}
						onPress={() => {
							console.log(1)
						}}
						title={'Информация'}
						color={'blue'}
					/>
					<Button
						style={styles.button}
						onPress={() => {
							console.log(2)
						}}
						title={'Использовать'}
						color={'red'}
					/>
				</View>
			)
		}

		return (
			<View style={styles.item}>
				<TouchableOpacity style={styles.inside} onPress={() => {
					this.toggleDetails();
				}}>
					<ImageBackground style={styles.inside} source={C.getImage('ds1/slots/new/empty.jpg')} resizeMode="contain">
						{C.getManager('stuff').image(this.compileItem())}
					</ImageBackground>
				</TouchableOpacity>
				{buttons}
			</View>
    )
  }
}
  
export default Inventory;