import React from 'react';
import { Button, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Dims from '../../utils/dimensions.js';
import C from '../../engine/c.js';
import { ShopActions } from '../../engine/actions.js';

const k = 2,
	W = Dims.width(3),
	I = Dims.itemSide(),
	CURRENCY = 'currency';

class Item extends React.Component {
  render() {
		var StuffManager = C.getManager('stuff'),
			item = this.props.item,
			item_config = {
				type:CURRENCY,
				params:{
					id:item.game_currency,
					quantity:item.count
				}
			},
			price;

		if(item.appstore_data){
			price = (
				<Text>{item.appstore_data.localizedPrice}</Text>
			);
		}

		return (
			<TouchableOpacity style={{
				width:W,
				height:W*k,
				justifyContent:'center',
				borderColor:'black',
				borderWidth:2
			}} onPress={() => {
				ShopActions.event('purchase',item);
			}}>
				<Text style={{
					textAlign:'center',
					height:88,
					fontSize:21
				}}>
					{item.title}
				</Text>
				<Image source={C.getImage(item.image)} style={{
					width:I,
					height:I
				}} />
				{price}
			</TouchableOpacity>
    )
  }
}
  
export default Item;