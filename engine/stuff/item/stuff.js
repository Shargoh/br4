import React from 'react';
import Image from './image';
import Print from './print';
import Proto from '../proto';
import C from '../../c';

class Item extends Proto{
	constructor(config){
		super(config);
    
    this.proto = C.refs.ref('item_proto|'+config.params.id);
    this.item = Object.assign({},this.proto,config.item_params);
    this.config = config;
	}
	print(){
		return (
			<Print config={this.config} proto={this.proto} item={this.item} key={Math.random().toString()} />
		);
	}
	image(){
		return (
			<Image config={this.config} proto={this.proto} item={this.item} key={Math.random().toString()} />
		);
	}
}

export default Item;
