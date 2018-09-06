import C from '../c.js';
import Manager from './proto.js';
import Accounts from '../../modules/accounts.js';
import State from '../../modules/state.js';
import GlobalActions from '../actions.js';
import Reflux from 'reflux';

import Empty from '../../services/Empty.js';
import Location from '../../services/Location.js';
import Room from '../../services/Room.js';
import ShowComponent from '../../services/ShowComponent.js';
import Surging from '../../services/Surging.js';
import Inventory from '../../services/Inventory.js';
import SpecialDeal from '../../services/SpecialDeal.js';
import Shop from '../../services/Shop.js';

const classes = {
	Empty,
	Location,
	Room,
	ShowComponent,
	Surging,
	Inventory,
	SpecialDeal,
	Shop
}

class ServiceManager extends Manager{
	constructor(){
		super();
		this.type = 'service';
		this.services = {};

		Reflux.ListenerMethods.listenTo(GlobalActions.initServices,(services) => {
			this.initialize(services);
		});
	}
	initialize(services) {
		// инициализация сервисов из конфига
		if(services && services.length){
			for(let i = 0; i < services.length; i++){
				let data = services[i],
					service = this.factory(data.service_id);

				if(service){
					service.init(data.service);
				}
			}
		}

		// Добавляю обработчик ответа от сервера по ключу "services"
		// me.addAjaxRequestKeyHandler('services', function(data) {
		// 	me.updateGroupOfServices(data.services);
		// }, me);
	}
	// onLaunch() {
	// 	var me = this;
	// 	Ext.each(config.services, function(data) {
	// 		ExGodsCore.AjaxRequest.invokeKeyHandlers(data); // обработчик возвращаемых данных
	// 	});
	// }
	/**
	 * Вернёт экземпляр сервиса по id
	 */
	factory(service_id) {
		var info = C.refs.ref('services|' + service_id),
			Class = this.getServiceClass(service_id),
			name = info.proto.package;

		if (info && Class) {
			if (Class.isSingle()) {
				if(!this.services[name]) {
					this.services[name] = new Class({
						id: service_id
					});
					
					return this.services[name];
				}

				return this.services[name];
			} else return new Class({
				id: service_id
			});
		} else {
			GlobalActions.error(!info ? 'Не найдена спрвочная информация для сервиса ' + service_id  : 'Не определён класс сервиса ' + name);
			return;
		}
	}
	/**
	 * Вернёт экземпляр глобального сервиса (single) по названию прототипа (package)
	 */
	get(name) {
		var service = this.services[name];

		if (!service) {
			let refs = C.refs.refs.services;

			for(let service_id in refs){
				let info = refs[service_id];

				if(info.proto.package == name){
					return this.factory(service_id);
				}
			}

			GlobalActions.error('Сервис не найден',name);
		}else return service;
	}
	/**
	 * Обновляет данные по группе сервисов
	 * @param group Может быть именованой строкой для группы сервисов или непосредственно данными
	 */
	// updateGroupOfServices(group) {
	// 	var me = this,
	// 		_updateServices = function(services) {
	// 			Ext.each(services, function(data) {
	// 				var service = me.factory(data.service_id);
	// 				if (!service.error) {
	// 					service.update(data.service);
	// 				} else {
	// 					/***/ me.log('error', 'Ошибка инициализации сервиса: ' + service.error);
	// 				}
	// 				ExGodsCore.AjaxRequest.invokeKeyHandlers(data); // обработчик возвращаемых данных
	// 			});		
	// 		};

	// 	if (typeof group == 'string') {
	// 		me.request({
	// 			url: '/game.pl',
	// 			params: {
	// 				cmd: 'get_service_group_data',
	// 				group: group
	// 			},
	// 			success: function(json) {
	// 				// считаем, что ответ всегда прийдёт в формате {services: ..},
	// 				// и данные будут обработаны через обработчик возвращаемых данных
	// 			}
	// 		});
	// 	} else {
	// 		_updateServices(group);
	// 	}
	// }
	/**
	 * Вернёт класс серсиса
	 */
	getServiceClass(service_id) {
		var me = this,
			info = C.refs.ref('services|' + service_id);

		if (info) {
			let parts = info.proto['package'].split('_'),
				name = '';

			for(let i = 0; i < parts.length; i++) {
				name += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
			}

			return classes[name];
		}
	}
};

export default ServiceManager;