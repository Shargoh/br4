import Manager from './proto';
import Item from '../stuff/item/stuff';

class StuffManager extends Manager {
	constructor(){
		super();

		this.type = 'stuff';
		this.types = {};
		this.objects = [];

		this.features = {};
		this.items = {};

		// регистрирую классы базовых типов имущества
		this.register({'item':Item});
		// this.register({'ability':require("engine/stuff/ability/stuff")});
		// this.register({'bonus':require("engine/stuff/bonus/stuff")});
		// this.register({'other':require("engine/stuff/bonus/stuff")});
		// this.register({'timed':require("engine/stuff/bonus/stuff")});
		// this.register({'resources':require("engine/stuff/currency/stuff")});
		// this.register({'ship':require("engine/stuff/ship/stuff")});
	}
	register(config) {
		for(var name in config){
			this.types[name] = config[name];
		}
	}
	image(config){
		if(!Array.isArray(config)) config = [config];
		var i = config.length,
			els = [],
			el;

		while(i--){
			el = new this.types[config[i].type](config[i]);
			els.push(el.image());
		}

		return els;
	}
	print(config){
		if(!Array.isArray(config)) config = [config];
		var i = config.length,
			els = [],
			el;

		while(i--){
			el = new this.types[config[i].type](config[i]);
			els.push(el.print());
		}

		return els;
	}
	printLarge(config){
		if(!Array.isArray(config)) config = [config];
		var i = config.length,
			els = [],
			el;

		while(i--){
			el = new this.types[config[i].type](config[i]);
			els.push(el.printLarge(config[i]));
		}

		return els;
	}
};

export default StuffManager;