import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import accounts_store_config from '../stores/accounts.js';
import { AsyncStorage } from 'react-native';
import GlobalActions, { ChatConnectionActions } from '../engine/actions.js';
import app_store_config from '../stores/app_store.js';
import Refs from '../engine/refs.js';
import request, { baseRequest } from '../utils/request.js';

/**
 * States:
 * 	1 - Add Account
 * 	2 - Account List
 * 	3 - Location (Surging)
 */

class Module extends Proto{
	constructor(){
		super();
		this.name = "State";
		this.store = C.createStore('AppStore',app_store_config);
		this.store.set({
			state:1
		});
		this.listenTo(ChatConnectionActions.ready,'showGame');
		this.listenTo(GlobalActions.state,'setState');
		this.listenTo(GlobalActions.showLocation,'showLocation');
		this.listenTo(GlobalActions.showBattle,'showBattle');
	}
	onEnterGame(account){
		C.lock({
			full:true
		});

		request('reg','mobile_mail_enter',{
      login:account.email,
      pass:account.password
    }).then((json) => {
			GlobalActions.log('RD получен',json.rd);
			
			this.store.set({
				rd:json.rd
			});

			return baseRequest('main','config');
		}).then((response) => {
			return response.text();
		}).then((str) => {
			var i = str.indexOf('{'),
				j = str.lastIndexOf('}') + 1,
				config = JSON.parse(str.slice(i,j));

			/**
				"social",
				"menu",
				"intercourse",
				"location",
				"services",
				"force_compact",
				"user",
				"chat",
				"test",
				"references",
				"contact",
				"auth_cookie",
				"bots",
				*/

			C.refs = new Refs(config.references);
			// только здесь инициализирую все игровые модули, чтобы не тупить на старте приложения
			GlobalActions.init();
			GlobalActions.initServices(config.services);
			GlobalActions.updateLocation(config.location);
			GlobalActions.setUser(config.user);
			// GlobalActions.initAnimations();
			// this.showGame();
			// dispatch(setRealCurrency(config.references.real_currency));
			return C.getModule('ChatConnection').connect();
		}).catch((error) => {
			GlobalActions.error(error);
      C.unlock();
		});
	}
	setState(state){
		this.store.set({
			state:state
		});
	}
	showGame(){
		var user = C.getStore('User');

		if(user.getBattle()){
			this.showBattle();
		}else{
			this.showLocation();
		}
	}
	showLocation(){
		C.getModule('Location').show().then(() => {
			this.setState(3);
			C.unlock();
		})
	}
	showBattle(){
		C.getModule('Battle').show();
	}
};

export default Module;