import React from 'react';
import { FlatList } from 'react-native';
import SpecialDealListItem from './SpecialDealListItem';
import Dims from '../../utils/dimensions.js';

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
					<SpecialDealListItem deal={item} />
				)}
				keyExtractor={(item, index) => 'item'+item.name}
			/>
    )
  }
}
  
export default List;