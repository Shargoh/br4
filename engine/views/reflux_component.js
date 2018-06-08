import React from 'react';
import C from '../../engine/c.js';
import Reflux from 'reflux';

class RefluxComponent extends React.Component {
	constructor(props, context) {
		super(props, context);
		
		for(let method in Reflux.ListenerMixin){
			this[method] = Reflux.ListenerMixin[method];
		}
	}
	/**
	 * 
	 * @param {String|Object} store - название хранилища для поиска в сохраненных хранилищах, или само хранилище
	 * @param {String} key - ключ, по которому потом обращаться к хранилищу 
	 * @param {Function} callback - особый метод обработки изменений хранилища, если не подходит метод по умолчанию
	 */
	bindStore(store,key,callback){
		key = key || 'store';

		if(typeof store == 'string'){
			store = C.getStore(store);
		}

		if(!store) return;

		this[key] = store;
		this.listenTo(store,callback || this.onAction);
	}
	/**
	 * 
	 * @param {String|Object} store - название сервиса для поиска в сохраненных хранилищах, или сам сервис
	 * @param {String} key - ключ, по которому потом обращаться к сервису
	 * @param {Function} callback - особый метод обработки изменений хранилища сервиса, если не подходит метод по умолчанию
	 */
	bindService(service,key,callback){
		key = key || 'service';

		if(typeof service == 'string'){
			service = C.getManager('service').get(service);
		}

		if(!service) return;

		this[key] = service;
		this.listenTo(service.store,callback || this.onAction);
	}
	onAction(action,data){
		if(action == 'change'){
			//в этом случае дата - это стор
			this.setState(data.attributes);
		}
	}
	/**
	 * 
	 * @param {String|Object} service - сервис, из которого обновить состояние 
	 */
	updateServiceState(service){
		if(typeof service == 'string'){
			service = C.getManager('service').get(service);
		}

		if(!service){
			service = this.service;
		}

		if(!service) return;

		this.setState(service.store.attributes);
	}
}

export default RefluxComponent;