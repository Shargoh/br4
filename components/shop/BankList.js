import React from 'react';
import { FlatList } from 'react-native';
import BankListItem from './BankListItem';
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
					<BankListItem item={item} />
				)}
				keyExtractor={(item, index) => 'bank_item'+item.entry}
			/>
    )
  }
}
  
export default List;