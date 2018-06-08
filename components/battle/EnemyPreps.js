import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { ScrollView, FlatList, Text, View, Button, TouchableOpacity } from 'react-native';
import GlobalActions from '../../engine/actions.js';
import C from '../../engine/c.js';

class Info extends RefluxComponent {
	getAuras(){
		var user = this.props.user,
			auras = [],
			user_auras = user.aura,
			empty_auras = [],
			i = 0;

		/**
		 * user.aura = [["60", 0, 0]]
		 */

		for(; i < user_auras.length; i++){
			console.log(typeof C.refs.battle_aura)

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
						<View key={'aura'+item.id} style={{
							flex:1,
							borderWidth:1,
							borderColor:'black',
							justifyContent:'center',
							margin:5
						}}>
							<Text>{item.label}</Text>
						</View>
					))
				}
				{
					auras.empty_auras.map((item,index) => (
						<View key={'emptyaura'+index} style={{
							flex:1,
							borderWidth:1,
							borderColor:'black',
							justifyContent:'center',
							margin:5
						}}></View>
					))
				}
			</View>
    )
  }
}
  
export default Info;