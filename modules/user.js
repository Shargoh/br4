import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import Reflux from 'reflux';
import user_store_config from '../stores/user.js';
import GlobalActions from '../engine/actions.js';
import request from '../utils/request.js';

class Module extends Proto{
	constructor(){
		super();
		this.name = "User";

		Reflux.ListenerMethods.listenTo(GlobalActions.setUser,(data) => {
			this.setUser(data);
		});

		Reflux.ListenerMethods.listenTo(GlobalActions.updateUser,(callback) => {
			this.updateUser(callback);
		});
	}
	onInit(){
		this.store = C.createStore('User',user_store_config);
	}
	setUser(data){
		this.store.set(data);
		GlobalActions.userChanged(this.store);
	}
	updateUser(callback){
		return request('game','user').then((data) => {
			this.setUser(data);
			if(callback) callback();
			return data;
		});
	}
};

export default Module;