import * as errors from '../constants/errors.js';
import GlobalActions from '../engine/actions.js';
import C from '../engine/c.js';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { HOST_URL } from '../constants/common';

/**
 * Стандартная обертка над запросом
 * @param {String} script - название скрипта, куда слать запрос. reg, game, main, map
 * @param {String} cmd - команда запроса
 * @param {Object} data - данные запроса
 * @param {Object} options - опции запроса
 * 	@param {Boolean} loader - показывать ли экран загрузки. По умолчанию false
 * 	@param {String} loader_text - специфический текст загрузчика
 */
export function baseRequest(script,cmd,data = {},options = {}) {
	var uuid, platform;

	if(!cmd){
		GlobalActions.error(errors.NO_CMD);
	}

	if(options.loader){
		let loader = {
			locked:true
		}

		if(options.loader_text){
			loader.text = options.loader_text;
		}

		C.lock(loader);
	}

	try{
		uuid = DeviceInfo.getUniqueID();
		platform = Platform.OS;
	}catch(error){
		uuid = 32132;
		platform = 'ios';
	}
	
	var form = new FormData();

	for(let key in data){
		form.append(key,data[key]);
	}

	form.append('payment',platform);
	form.append('device',uuid);
	form.append('rd',C.getStore('AppStore').get('rd'));
	form.append('r',Math.random().toString());

	return fetch(HOST_URL+script+'.pl?cmd='+cmd,
		{
			method:'POST',
			body:form
		}
	).catch((error) => {
		GlobalActions.error('request error on cmd: ',script,cmd,error);
		throw error;
	});
}

function request(script,cmd,data = {},options = {}){
	return baseRequest(script,cmd,data,options).then((response) => {
		return response.json();
	}).then((json) => {
		if(json.user){
			GlobalActions.setUser(json.user);
		}

		return json;
	}).catch((error) => {
		GlobalActions.error(error);
		throw error;
	});
}

export default request;