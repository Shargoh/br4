import React from 'react';
import C from '../engine/c.js';
import CSS from '../css/main.js';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component.js';
import SurgingList from '../components/surging/List.js';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';

class LocationContainer extends RefluxComponent {
	componentWillMount(){
		this.bindService('location');
		this.updateServiceState();
	}
  render() {
		return (
			<View style={CSS.container}>
				<SurgingList />
			</View>
		)
  }
}

export default LocationContainer;