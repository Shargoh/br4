import React from 'react';
import { Button, Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Dims from '../../utils/dimensions.js';
import C from '../../engine/c.js';
import { ShopActions } from '../../engine/actions.js';

const k = 2,
	W = Dims.width(3),
	ITEM = 'item',
	CURRENCY = 'currency';

class Item extends React.Component {
  render() {
		var StuffManager = C.getManager('stuff'),
			item = this.props.item;
			item_config = {
				type:ITEM,
				params:{
					id:item.item.item,
					quantity:1
				}
			},
			price_config = {
				type:CURRENCY,
				params:{
					id:item.price[0].name,
					quantity:item.price[0].value
				}
			}

		return (
			<View style={{
				width:W,
				height:W*k,
				justifyContent:'center',
				borderColor:'black',
				borderWidth:2
			}}>
				<Text style={{
					textAlign:'center',
					height:88,
					fontSize:21
				}}>
					{StuffManager.print(item_config)}
				</Text>
				{StuffManager.image(item_config)}
				{StuffManager.print(price_config)}
				<Button
					style={{
						width:W
					}}
					onPress={() => {
						ShopActions.event('buy',item);
					}}
					title={'Купить'}
					color={'red'}
				/>
			</View>
    )
  }
}
  
export default Item;