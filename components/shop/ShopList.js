import React from 'react';
import { FlatList } from 'react-native';
import ShopListItem from './ShopListItem';
import Dims from '../../utils/dimensions';

class List extends React.Component {
  render() {
		return (
			<FlatList
				// style={{
				// 	marginTop:70
				// }}
				horizontal={false}
				numColumns={3}
				data={this.props.list}
				renderItem={({item}) => (
					<ShopListItem item={item} />
				)}
				keyExtractor={(item, index) => 'shop_item'+item.entry}
			/>
    )
  }
}
  
export default List;