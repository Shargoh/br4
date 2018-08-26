import React from 'react';
import C from '../engine/c.js';
import CSS from '../css/main.js';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component';
import QuickSlots from '../components/inventory/QuickSlots';
import Inventory from '../components/inventory/Inventory';
import ChangeItem from '../components/inventory/ChangeItem';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';

/**
 * state
 * 	1 - показывается обычный интерфейс
 * 	2 - показывается интерфейс замены карты
 */
class InventoryContainer extends RefluxComponent {
	componentWillMount(){
		this.bindService('inventory');
		this.setState({
			state:1
		})
	}
	onAction(action,state){
		if(action == 'state'){
			this.setState({
				state:state
			});
		}
	}
  render() {
		if(this.state.state == 1){
			return (
				<ScrollView>
					<QuickSlots />
					<Inventory />
				</ScrollView>
			)
		}else{
			return (
				<ScrollView>
					<QuickSlots />
					<ChangeItem />
				</ScrollView>
			)
		}
  }
}

export default InventoryContainer;