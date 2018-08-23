// var _ = require("lodash"),
//     Proto = require("../proto"),
//     React = require("react"),
//     C = require("C"),
//     Image = require("./image"),
//     PrintLarge = require("./print_large"),
//     Print = require("./print"),

import Proto from '../proto';
import C from '../../c';

class Item extends Proto{
	constructor(config){
		super(config);
    
    this.proto = C.config.prototypes.items[config.params.name];
    this.item = Object.assign({},this.proto,config.item_params);
    this.config = config;
	}
	print(){
		// return (
		// 	<Print config={this.config} proto={this.proto} item={this.item} key={Math.random().toString()} />
		// );
	}
	image(){
		return (
			<Image config={this.config} proto={this.proto} item={this.item} key={Math.random().toString()} />
		);
	}
}

export default Item;
