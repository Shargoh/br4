'use strict';
import _ from 'lodash';
import Reflux from 'reflux';
import images from '../image_paths';

class C {
	constructor(){
		/**
		 * Reflux StoreMethods
		 */
		Reflux.StoreMethods.set = function(data, options){
			options = options || {};
			
			var valid = this.beforeSet(data,options);
			if(valid === false) return;
			
			if(!this.attributes){
				this.attributes = data;
			}else{
				if(!this.previous)
					this.previous = {};
				
				for(var key in data){
					if(_.isEqual(this.attributes[key],data[key])){
						delete data[key];
					}else{
						this.previous[key] = this.attributes[key];
					}
				}
				
				_.extend(this.attributes,data);
				
				this.changed = data;
			}
			
			if(!options.silent){
				this.trigger('change',this);
			}
			
			this.onSet(data,options);
		};
		Reflux.StoreMethods.get = function(key){
			return this.attributes ? this.attributes[key] : undefined;
		};
		Reflux.StoreMethods.prev = function(key){
			if (this.previous) {
				return this.previous[key];
			}
		};
		Reflux.StoreMethods.beforeSet = function(data){};
		Reflux.StoreMethods.onSet = function(data){};
		Reflux.StoreMethods.onEvent = function(evtName,view,data){
			var methodName = CommonUtils.makeMethod('on',evtName);
			if(this[methodName] && typeof this[methodName] == 'function'){
				this[methodName](view,data);
			}
		};
		
		this.stores = {};

		this.images = images;
	}
	promise(method){
		var self = this;

		return new Promise(function(resolve,reject){
			setTimeout(method.bind(self,resolve,reject),0);
		});
	}
	api() {
		return this.App.api.apply(this,arguments);
	}
	getModule(name){
		return this.App.managers.module.modules[name];
	}
	createStore(storeName,cfg){
		if(!this.stores[storeName])
			this.stores[storeName] = Reflux.createStore(cfg);
		return this.stores[storeName];
	}
	getStore(storeName){
		return this.stores[storeName];
	}
	getManager(name) {
		return this.App.managers[name];
	}
	//'item','ability'
	loadProto(type,ids){
		if(!Array.isArray(ids)){
			ids = [ids];
		}else{
			ids = [].concat(ids);
		}

		var me = this,
			elements,
			i = ids.length;

		switch(type){
			case 'item':
				elements = this.config.prototypes.items;
				break;
			case 'ability':
				elements = this.getManager('stuff').abilities;
				break;
		}

		while(i--){
			if(elements[ids[i]]){
				ids.splice(i,1);
			}
		}

		if(ids && ids.length){
			return this.promise(function(resolve,reject){
				me.api('user:loadProto',{
					type:type,
					ids:ids
				}).then(function(protos){
					if(elements){
						_.each(protos,function(proto,id){
							elements[id] = proto;
						});
					}
					resolve();
				});
			});
		}else{
			return Promise.resolve();
		}
	}
	loadImages(images,callback){
		if((!images || !images.length) && callback){
			return callback();
		}

		if(!Array.isArray(images)) images = [images];

		var loading = images.length,
			i = loading,
			img,
			cb = function(){
				loading--;

				if(!loading && callback){
					callback();
				}
			};

		while(i--){
			img = new Image();
			img.src = images[i];
			img.onload = cb;
			img.onerror = cb;
		}

		setTimeout(function(){
			if(loading > 0 && callback) callback();
		},10000);
	}
};

const c = new C;

export default c;