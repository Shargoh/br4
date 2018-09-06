import React from 'react';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component.js';
import SpecialDeals from '../components/shop/SpecialDeals';
import Shop from '../components/shop/Shop.js';
import Bank from '../components/shop/Bank.js';
import { ScrollView } from 'react-native';

class ShopContainer extends RefluxComponent {
  render() {
		return (
			<ScrollView>
				<SpecialDeals />
				<Shop />
				<Bank />
			</ScrollView>
		)
  }
}

export default ShopContainer;