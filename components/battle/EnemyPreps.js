import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, View, Image } from 'react-native';
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
			let aura = C.refs.ref('battle_aura|'+user_auras[i][0]);

			if(aura){
				console.log('AURA',aura);

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
							<Image source={C.images[item.params.images.large]} />
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