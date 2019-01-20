import C from '../engine/c.js';
import Reflux from 'reflux';
import Proto from '../engine/proto_module.js';
import GlobalActions, { LocationActions } from '../engine/actions.js';

class Module extends Proto{
	constructor(){
		super();
		this.name = "Location";
	}
	onInit(){
		var me = this;

		this.service = C.getManager('service').get('location');

		Reflux.ListenerMethods.listenTo(GlobalActions.updateLocation,(data) => {
			this.updateLocation(data);
		});

		Reflux.ListenerMethods.listenTo(LocationActions.event,function(){
			me.onEvent.apply(me,arguments);
		});

		GlobalActions.event('location_service_ready',this.service);

		this.menu_position = [];
	}
	updateLocation(data){
		this.service.store.set(data);
	}
	onToggleMenu(index,by_button){
		var active_menu = this.service.store.get('active_menu');

		if(active_menu == index) return;

		// if(by_button){
		// 	by_button = index - active_menu;
		// }

		this.service.store.trigger('menubutton',{
			index:index,
			by_button:by_button
		});

		this.service.store.set({
			active_menu:index
		});

		this.show();
	}
	triggerMenuLayout(){
		var active_menu = this.service.store.get('active_menu');

		this.service.store.trigger('active_menu_layout',this.menu_position[active_menu]);

		this._flag_waiting_position = false;
	}
	show(){
		var active_menu = this.service.store.get('active_menu');

		if(active_menu == undefined){
			this.service.store.set({
				active_menu:0
			});
			active_menu = 0;
		}

		if(this.menu_position[active_menu]){
			this.triggerMenuLayout();
		}else{
			this._flag_waiting_position = true;
		}

		var active_menu_data = this.service.store.get('location').blob.objects[active_menu],
			active_service_id = active_menu_data.client_action.id;

		if(!active_service_id) return Promise.resolve();

		var ServiceManager = C.getManager('service'),
			service = ServiceManager.getById(active_service_id);

		if(!service) return Promise.resolve();

		switch(service.info.proto.package){
			case 'surging':
				return C.getModule('Surging').show();
			case 'mobile_arena':
				return C.getModule('Arena').show(service);
			default:
				return Promise.resolve();
		}
	}
	onActiveMenuLayout(data){
		this.menu_position[data.index] = data;

		if(this._flag_waiting_position){
			let active_menu = this.service.store.get('active_menu');

			if(active_menu == data.index){
				this.triggerMenuLayout();
			}
		}
	}
};

export default Module;