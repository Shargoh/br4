import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import Reflux from 'reflux';
import { ChatConnectionActions, ShopActions } from '../engine/actions.js';

const shop_service = 108;

class Module extends Proto{
	constructor(){
		super();

		var me = this;

		this.name = "Shop";

		this.listenTo(ChatConnectionActions.ready,'onConnectionReady');

		Reflux.ListenerMethods.listenTo(ShopActions.event,function(){
			me.onEvent.apply(me,arguments);
		});
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
		return this.shop_service.init().then(() => {
			return C.loadProto('item',this.shop_service.store.get('item_ids'));
		}).then(() => {
			this.shop_service.store.set({
				ready:true
			});
			this.shop_service.store.trigger('update_view',this.shop_service.store);
		});
	}
	onBuy(item){
		return this.shop_service.command('shop_buy',{
			basket:JSON.stringify([{
				items:[{
					count:1,
					item:item.entry
				}],
				shop:item.shop_id
			}])
		}).then(() => {
			console.log('bought');
		});
	}
};

export default Module;