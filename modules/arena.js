import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import arena_store_config from '../stores/arena.js';
import GlobalActions from '../engine/actions.js';

class Module extends Proto{
	constructor(){
		super();
		this.name = "Arena";
	}
	onInit(){
		// this.store = C.createStore('Arena',surging_store_config);
	}
	onLocationServiceReady(location_service){
		location_service.store.listen((action,store) => {
			// если мы меняем активную вкладку меню - нам не надо обновлять сервис
			if(action == 'change' && (!store.changed || store.changed.active_menu === undefined)){
				this.onLocationChange(store);
			}
		});

		// this.initServices(location_service.store);
	}
	onLocationChange(store){
		// this.initServices(store);
	}
	initServices(location_store){
		var services = location_store.getBindableServices('mobile_arena');

		return Promise.all(services.map((service) => {
			return service.show(null);
		}));
	}
	show(service){
		return service.show();
	}
};

export default Module;