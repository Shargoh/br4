import React from 'react';
import C from '../engine/c.js';
import Reflux from 'reflux';
import RefluxComponent from '../engine/views/reflux_component.js';
// import CSS from '../css/main.js';
// import Preloader from '../components/Preloader.js';
import AddAccount from '../components/accounts/Add.js';
import AccountList from '../components/accounts/List.js';
import Location from '../containers/location.js';
import Battle from '../containers/battle.js';
import { StyleSheet, Text, View, Button, Alert, TextInput } from 'react-native';

class BaseLayer extends RefluxComponent {
	componentWillMount(){
		this.bindStore('AppStore');
		this.setState(this.store.attributes);
	}
  render() {
		var state = this.state.state;

    if(state == 1){
			return <AddAccount />
		}else if(state == 2){
			return <AccountList />
		}else if(state == 3){
			return <Location />
		}else if(state == 4){
			return <Battle />
		}
  }
}

export default BaseLayer;