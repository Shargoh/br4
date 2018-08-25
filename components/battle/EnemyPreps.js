import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { View, ImageBackground, StyleSheet } from 'react-native';
import C from '../../engine/c.js';

const styles = StyleSheet.create({
  item: {
    flex:1,
		borderWidth:1,
		borderColor:'black',
		justifyContent:'center',
		margin:5
  }
});

class Info extends RefluxComponent {
	getAuras(){
		var user = this.props.user || {},
			auras = [],
			user_auras = user.aura || [],
			empty_auras = [],
			i = 0;

		/**
		 * user.aura = [["60", 0, 0]]
		 */

		for(; i < user_auras.length; i++){
			let aura = C.refs.ref('battle_aura|'+user_auras[i][0]);

			if(aura){
				auras.push(aura);
			}
		}

		for(; i < 4; i++){
			empty_auras.push({});
		}

		return {
			auras:auras,
			empty_auras:empty_auras
		}
	}
	render() {
		var auras = this.getAuras();

		return (
			<View style={{
				flex:1,
				justifyContent:'space-around',
				flexDirection:'row'
			}}>
				{
					auras.auras.map((item,index) => (
						<ImageBackground key={'aura'+item.id} style={styles.item} source={C.getImage(item.params.images.large)} resizeMode="contain">
						</ImageBackground>
					))
				}
				{
					auras.empty_auras.map((item,index) => (
						<View key={'emptyaura'+index} style={styles.item}></View>
					))
				}
			</View>
    )
  }
}
  
export default Info;