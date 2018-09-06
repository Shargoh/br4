import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import Reflux from 'reflux';
import { ChatConnectionActions } from '../engine/actions.js';

const shop_service = 100;

class Module extends Proto{
	constructor(){
		super();
		this.name = "Shop";

		this.listenTo(ChatConnectionActions.ready,'onConnectionReady');
	}
	/**
	 * нужно привязываться к коннекту к чату, т.к. тогда уже известна разница времени с сервером.
	 */
	onConnectionReady(){
		this.deal_service = C.getManager('service').get('special_deal');
		// данные сервис уже запросил, так что надо просто обновить таймеры, т.к. теперь я знаю разницу с сервером
		this.deal_service.store.updateTimers();

		this.shop_service = C.getManager('service').factory(shop_service);
	}
	show(){
		return this.shop_service.init().then((json) => {
			console.log('shop initialized',json);
		});
	}
};

export default Module;