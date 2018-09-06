import C from '../engine/c.js';
import Reflux from 'reflux';
import Proto from '../engine/proto_module.js';
import GlobalActions from '../engine/actions.js';

class Module extends Proto{
	constructor(){
		super();
		this.name = "Location";
	}
	onInit(){
		this.service = C.getManager('service').get('location');

		Reflux.ListenerMethods.listenTo(GlobalActions.updateLocation,(data) => {
			this.updateLocation(data);
		});

		GlobalActions.event('location_service_ready',this.service);
	}
	updateLocation(data){
		this.service.store.set(data);
	}
	onToggleMenu(index,by_button){
		var active_menu = this.service.store.get('active_menu');

		if(active_menu == index) return;

		if(by_button){
			by_button = index - active_menu;
		}

		this.service.store.trigger('menubutton',{
			index:index,
			by_button:by_button
		});

		this.service.store.set({
			active_menu:index
		});
	}
	show(){
		var active_menu = this.service.store.get('active_menu');

		if(active_menu == undefined){
			this.service.store.set({
				active_menu:0
			});
			active_menu = 0;
		}

		switch(active_menu){
			case 0:
				return C.getModule('Surging').show();
			case 2:
				return C.getModule('Shop').show();
			default:
				return Promise.resolve();
		}
	}
};

export default Module;