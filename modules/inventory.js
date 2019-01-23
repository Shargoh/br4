import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import React from 'react';
import Reflux from 'reflux';
import GlobalActions, { InventoryActions } from '../engine/actions.js';
import { Alert } from 'react-native';

class Module extends Proto{
	constructor(){
		super();
		this.name = "Inventory";

		var me = this;

		Reflux.ListenerMethods.listenTo(InventoryActions.event,function(){
			me.onEvent.apply(me,arguments);
		});
	}
	/**
	 * 
	 * @param {*} data 
	 * 	service (данные сервиса)
	 * 	object (клиентский объект)
	 */
	show(data){
		GlobalActions.window('inventory');
	}
	onInit(){
		this.service = C.getManager('service').get('inventory');
	}
	onSlots(slots){
		var prepared = {},
			i = slots.length;

		while(i--){
			prepared[slots[i].ekey] = slots[i];
		}

		this.service.store.set({
			slots:prepared
		});
	}
	onContext(react_element,item){
		var context = this.service.store.get('context');

		if(context && context.item_id == item.item_id){
			this.service.store.set({
				context:{}
			});
		}else{
			react_element.measure((x, y, width, height, pageX, pageY) => {
				this.service.store.set({
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
		var context = this.service.store.get('context');

		this.service.store.set({
			state:2
		});
		this.service.store.trigger('state',2);
	}
	onUnselect(){
		this.service.store.trigger('state',1);
		this.service.store.set({
			state:1,
			context:{}
		});
	}
	onChangeItem(slot){
		if(!slot || !slot.ekey){
			return Alert.alert('Это заглушка под слот. В релизе такого быть не должно');
		}

		//keys: 'type', 'items', 'name', 'protect', 'ekey'
		var context = this.service.store.get('context');

		if(!context || !context.item){
			return this.onUnselect();
		}

		C.lock();

		this.service.command('item_on',{
			item:context.item.item_id,
			slot:context.item.slot_id,
			slot_to:slot.ekey
		}).then((json) => {
			if (!json.success || !json.user) {
				// запрашиваю актуальное состояние слотов, если ответ отрицательный или нет данных по юзеру  
				// me.user.loadRemote(function() {
				// 	//
				// });
			}

			this.onUnselect();
			C.unlock();
		}).catch(() => {
			this.onUnselect();
			C.unlock();
		});
	}
	onDrop(index){
		this.service.store.trigger('dropped',index);
	}
	onHighlightQuickSlot(index){
		this.service.store.trigger('highlight',index);
	}
};

export default Module;