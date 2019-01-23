'use strict';
import _ from 'lodash';
import C from './c.js';
import CommonUtils from './utils/common.js';
import StuffManager from './managers/stuff.js';
import ModuleManager from './managers/module.js';
import LockManager from './managers/lock.js';
import ServiceManager from './managers/service.js';
import LogManager from './managers/log.js';

class Ticker{
	constructor(){
		this.fns = [];
	}
	on(fn){
		if(this.fns.indexOf(fn) == -1 && typeof fn == 'function'){
			this.fns.push(fn);
		}
		  
		return this;
	}
	off(fn){
		if(typeof fn == 'function'){
			var index = this.fns.indexOf(fn);
				
			if (index != -1){
				this.fns.splice(index,1);
			}
		}
		  
		return this;
	}
	start(){
		var me = this;
		  
		me.interval = setInterval(function(){
			var i = me.fns.length,
				time = Math.floor(Date.now()/1000);
				
			while(i--){
				if(typeof me.fns[i] == 'function'){
					me.fns[i](time);
				}
			}
		},1000);
		  
		return me;
	}
};

class APP{
	constructor(){
		this.managers = {};
		// this.api = new API();
	}
	start(managers){
		managers = managers || ['window','stuff','module','lock'];
		  
		var i = managers.length,
			type;
				
		while(i--){
			this.createManager(managers[i]);
		}

		for(type in this.managers){
			this.managers[type].init();
		}
		  
		// C.getManager('lock').addLoader(2000);
		// C.getManager('lock').prevent_api_unlock = true;
		  
		C.Ticker = new Ticker().start();
		  
		// Factory.registerPrints({
		//     timer:require("print/timer"),
		//     user:require("print/user")
		// });

		return this;
	}
	createManager(type){
		if(!this.managers[type]){
			this.managers[type] = this['_create'+CommonUtils.capitalize(type)+'Manager']();
		}
	}
	_createWindowManager(){
		// return new WindowManager();
	}
	_createStuffManager(){
		return new StuffManager();
	}
	_createModuleManager(){
		return new ModuleManager();
	}
	_createLockManager(){
		return new LockManager();
	}
	_createServiceManager(){
		return new ServiceManager();
	}
	_createLogManager(){
		return new LogManager();
	}
};

export default APP;