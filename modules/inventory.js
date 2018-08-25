import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import React from 'react';
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
	onContext(react_element,item){
		var context = this.store.get('context');

		if(context && context.item_id == item_id){
			this.store.set({
				context:{}
			});
		}else{
			react_element.measure((x, y, width, height, pageX, pageY) => {
				this.store.set({
					context:{
						item:item,
						item_id:item.item_id,
						x:pageX,
						y:pageY
					}
				})
			});
		}
	}
	onSelect(){
		var context = this.store.get('context');

		this.store.trigger('state',2);
	}
};

export default Module;