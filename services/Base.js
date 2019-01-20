import C from '../engine/c.js';
import Reflux from 'reflux';
import request from '../utils/request.js';
import GlobalActions from '../engine/actions.js';
/**
 * Базовый класс сервиса
 */
export default class BaseService{
	constructor(config){
		this.initStaticProperties();
		this.initialized = false;
		this.id = config.id;
		this.info = C.refs.ref('services|' + this.id);
		this.store = Reflux.createStore(this.getStoreConfig());
	}
	/**
	 * @property Если isSingle, будет создан только один экземпляр сервиса
	 */
	static isSingle(){
		return true;
	}
	/**
	 * @property Если canShow, будет запрашиваться информация через get_service_show там
	 * где нет необходимости получать полные данные
	 */
	static canShow(){
		return false;
	}
	getStoreConfig(){
		return {};
	}
	/**
	 * @property Если true, то сервис может быть проинициализирован многократно (например,
	 * каждый раз когда выполняется клиентское действие, связанное с сервисом)
	 * @property Урл команд
	 */
	initStaticProperties(){
		this.multiple_init = false;
		this.commands_url = 'map';
	}
	/**
	 * Инициализация сервиса
	 * @param {Object} data - данные сервиса
	 * @param {Object} opts - опции запроса
	 */
	init(data,opts){
		if (this.requesting_init) return Promise.reject();
		if (this.initialized && !this.multiple_init) return Promise.resolve(this);

		this.beforeInit();

		if(data){
			this.finishInit(data);
			return Promise.resolve(this);
		}

		this.requesting_init = true;

		return request('game','get_service_data',{
			service_id:this.id
		},opts).then((json) => {
			if (json.success) {
				this.finishInit(json.service);
			} else {
				GlobalActions.error('Отрицательный ответ от сервера: ',json.msg || '');
			}

			this.requesting_init = false;
		}).catch((error) => {
			GlobalActions.error('Ошибка запроса сервиса: ',error);
			this.requesting_init = false;
		});
	}
	/**
	 * Инициализация сервиса
	 * @param {Object} data - данные сервиса
	 * @param {Object} opts - опции запроса
	 */
	show(data,opts){
		if (this.requesting_show) return Promise.reject();
		if (this.initialized && !this.multiple_init) return Promise.resolve(this);

		if(data){
			this.finishUpdate(data);
			return Promise.resolve(this);
		}

		this.requesting_show = true;

		return request('game','get_service_show',{
			service_id:this.id
		},opts).then((json) => {
			if (json.success) {
				this.finishUpdate(json.service);
			} else {
				GlobalActions.error('Отрицательный ответ от сервера: ',json.msg || '');
			}

			this.requesting_show = false;
		}).catch((error) => {
			GlobalActions.error('Ошибка запроса сервиса: ',error);
			this.requesting_show = false;
		});
	}
	/**
	 * @templates
	 */
	onInit(){}
	beforeInit(){}
	onUpdate(){}
	finishInit(data){
		this.initialized = true;
		this.store.set(data);
		this.onInit();
	}
	/**
	 * Обновить данные сервиса
	 * @param {Object} data - данные сервиса
	 * @param {Object} opts - опции запроса
	 */
	update(data,opts) {
		if(data){
			this.finishUpdate(data);
			return Promise.resolve();
		}

		return request('game','get_service_data',{
			service_id:this.id
		},opts).then((json) => {
			if (json.success) {
				this.finishUpdate(json.service);
			} else {
				GlobalActions.error('Отрицательный ответ от сервера: ',json.msg || '');
			}
		}).catch((error) => {
			GlobalActions.error('Ошибка запроса сервиса: ',error);
		});
	}
	finishUpdate(data){
		this.store.set(data);
		this.onUpdate();
	}
	/**
	 * Выполнить команду сервиса
	 * @param {String} cmd - команда сервиса
	 * @param {Object} params - параметры запроса
	 * @param {Object} opts - опции запроса
	 */
	command(cmd, params, opts) {
		params = params || {};
		params.service_id = this.id;
		opts = opts || {};

		return request(this.commands_url,cmd,params,opts).then((json) => {
			if(json.success){
				if(json.service){
					this.finishUpdate(json.service);
				}
				return json;
			}else throw new Error('unsuccessfull service request '+cmd);
		});
	}
}