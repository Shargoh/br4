import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import GlobalActions, { ChatConnectionActions } from '../engine/actions.js';
import { HOST_URL, WS } from '../constants/common.js';
import request from '../utils/request.js';
import dateFormat from 'dateformat';
import CommonUtils from '../engine/utils/common.js';
import DateUtils from '../engine/utils/date.js';
import CookieManager from 'react-native-cookies';

class Module extends Proto{
	constructor(){
		super();
		this.name = "ChatConnection";
		this.subcribtions = {};
	}
	connect(){
		var me = this;

		/***/ GlobalActions.log('запрашиваем коннект к сокетам');

		ChatConnectionActions.beforeConnect(this);

		return request('game','connect',{
			localtime: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')
		}).then((result) => {
			if (result.success == 1) {
				return this.ping().then(() => {
					return result;
				})
			}else throw 'connection failed';
		}).then((result) => {
			this.setPingTask();
			this.connectSocket(result);
		});
	}
	connectSocket(result){
		this.socket = new WebSocket(WS);

		this.socket.onopen = () => {
			CookieManager.get(HOST_URL).then((res) => {
				var session = res.id2 + ':' + res.session2;

				GlobalActions.log("Connected",session);
				ChatConnectionActions.ready(this,result);
				this.socket.send(session);
			});
		}
		this.socket.onmessage = ({data}) => {
			this.onMessage(data);
		}

		this.socket.onerror = (e) => {
			GlobalActions.log('SOCKET_ERROR',e.message);
		};
		
		this.socket.onclose = (e) => {
			GlobalActions.log('SOCKET_CLOSE',e.code, e.reason);
			this.connectSocket();
		};
	}
	setPingTask(){
		if(this.ping_task) return;

		this.ping_task = setInterval(() => {
			this.ping();
		},60000);
	}
	/**
	 * Добавить параметр к пингу
	 */
	addPingParam(param,value) {
		this.ping_params = this.ping_params || {};
		this.ping_params[param] = value;
	}
	/**
	 * @private
	 * Поддерживает игровую сессию
	 */
	ping(){
		var params = {};

		if (this.ping_params) {
			for(let key in this.ping_params) {
				if (typeof this.ping_params[key] == 'function') {
					params[key] = this.ping_params[key]();
				} else {
					params[key] = this.ping_params[key];
				}
			}
		}

		//отправляю статистику по количеству отправленных сообщений
		if(this.private_messages){
			params.private_messages = this.private_messages;
			this.private_messages = 0;
		}

		if(this.public_messages){
			params.public_messages = this.public_messages;
			this.public_messages = 0;
		}

		if(this.socket){
			this.socket.send('PING');
		}

		return request('ping','ping',params).then((result) => {
			if (result.success == 1) {
				DateUtils.setServerTimeDif(result.now*1000);
				ChatConnectionActions.ping(result);
			}
		}).catch((error) => {
			GlobalActions.error('Ping error',error);
		});
	}
	/**
	 * @private
	 * Обработка входящего сообщения
	 * @param {Object} data
	 */
	onMessage(data) {
		try{
			data = JSON.parse(data);
		}catch(e){
			GlobalActions.error('Invalid JSON in socket message');
			return;
		}

		/***/ GlobalActions.log('Сообщение по сокету:', Object.keys(data));

		if(!Array.isArray(data)) return;

		data.sort((a,b) => {
			if (!a.data.log_id) return 1;
			if (!b.data.log_id) return -1;
			return a.data.log_id - b.data.log_id;
		});

		for(let i = 0; i < data.length; i++){
			let config = data[i];

			if(!config.type) continue;

			ChatConnectionActions.messageCommand(config.type,config.data);
		}
	}
};

export default Module;