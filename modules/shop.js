import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import Reflux from 'reflux';
import GlobalActions, { ChatConnectionActions, ShopActions } from '../engine/actions.js';

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
		var ServiceManager = C.getManager('service');

		this.deal_service = ServiceManager.get('special_deal');
		// данные сервис уже запросил, так что надо просто обновить таймеры, т.к. теперь я знаю разницу с сервером
		this.deal_service.store.updateTimers();

		this.bank_service = ServiceManager.get('payment');

		this.shop_service = ServiceManager.factory(shop_service);
	}
	show(){
		return Promise.all([
			this.shop_service.init(),
			this.bank_service.init()
		]).then(() => {
			return Promise.all([
				C.loadProto('item',this.shop_service.store.get('item_ids')),
				this.bank_service.getProducts()
			]);
		}).then(() => {
			this.shop_service.store.set({
				ready:true
			});
			this.shop_service.store.trigger('update_view',this.shop_service.store);

			this.bank_service.store.set({
				ready:true
			});
			this.bank_service.store.trigger('update_view',this.bank_service.store);
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
			GlobalActions.log('bought');
		});
	}
	onPurchase(item){
		return this.bank_service.buy(item);
	}
	onDeal(deal){
		if(!deal) return;

		if(deal.preset){
			this.onPurchase(deal.preset);
		}else if(deal.presets && deal.presets.length && deal.presets[0]){
			this.onPurchase(deal.presets[0]);
		}else if(deal.actions && deal.actions.length && deal.actions[0]){
			this.deal_service.command('use_special_deal',{
				specialdeal:deal.name,
				action:deal.actions[0].action,
			}).then((data) => {
				if(data.specialdeal){
					this.deal_service.store.set({
						special_deal:data.special_deal
					});
				}
			});
		}
	}
};

export default Module;