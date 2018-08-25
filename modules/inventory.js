import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import Reflux from 'reflux';
import inventory_store_config from '../stores/inventory.js';
import { InventoryActions } from '../engine/actions.js';
import request from '../utils/request.js';

class Module extends Proto{
	constructor(){
		super();
		this.name = "Inventory";

		var me = this;

		Reflux.ListenerMethods.listenTo(InventoryActions.event,function(){
			me.onEvent.apply(me,arguments);
		});
	}
	onInit(){
		this.store = C.createStore('Inventory',inventory_store_config);
	}
	onSlots(slots){
		var prepared = {},
			i = slots.length;

		while(i--){
			prepared[slots[i].ekey] = slots[i];
		}

		this.store.set({
			slots:prepared
		});
	}
};

export default Module;