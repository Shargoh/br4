import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { ImageBackground, View, TouchableOpacity, Text } from 'react-native';
import { BattleActions } from '../../engine/actions.js';
import C from '../../engine/c.js';

const cells_count = 4;

class Preps extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Battle');
		this.setState(this.store.get('state'));
	}
	onAction(action,store){
		if(action == 'change' && store.changed.state){
			this.setState(store.changed.state);
		}
	}
	getPreps(){
		var map = [],
			l = this.state.av_prep.length;

		for(let i = 0; i < l; i++){
			let data = this.state.av_prep[i],
				prep = C.refs.ref('battle_prep|'+data.name);

			map.push({
				data:data,
				ref:prep
			});
		}

		return map;
	}
	getEmptyCells(){
		var map = [],
			l = cells_count - this.state.av_prep.length;

		for(let i = 0; i < l; i++){
			map.push({});
		}

		return map;
	}
	render() {
		return (
			<View style={{
				flex:1,
				justifyContent:'space-around',
				flexDirection:'row'
			}}>
				{
					this.getPreps().map((item,index) => {
						var cd;

						if(item.data.rest){
							cd = <View style={{
								width:'100%',
								height:'100%',
								alignItems:'center',
								backgroundColor:'rgba(0,0,0,0.5)',
							}}>
								<Text style={{
									fontSize:72,
									color:'yellow'
								}}>{item.data.rest}</Text>
							</View>
						}else if(!this.state.can_prep){
							cd = <View style={{
								width:'100%',
								height:'100%',
								backgroundColor:'rgba(0,0,0,0.5)',
							}}></View>
						}

						return <TouchableOpacity key={'prep'+item.data.name} style={{
							flex:1,
							borderWidth:1,
							borderColor:'black',
							justifyContent:'center',
							alignItems:'center',
							margin:5
						}} onPress={() => {
							if(this.state.can_prep){
								BattleActions.prep(item.data);
							}
						}}>
							<ImageBackground style={{
								width:'100%',
								height:'100%'
							}} source={C.getImage(item.ref.desc.images.active)} resizeMode="contain">
								{cd}
							</ImageBackground>
						</TouchableOpacity>
					})
				}
				{
					this.getEmptyCells().map((item,index) => (
						<View key={'prep'+index} style={{
							flex:1,
							borderWidth:1,
							borderColor:'black',
							margin:5
						}}></View>
					))
				}
			</View>
    )
  }
}
  
export default Preps;