import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import surging_store_config from '../stores/surging.js';
import GlobalActions from '../engine/actions.js';

class Module extends Proto{
	constructor(){
		super();
		this.name = "Surging";
	}
	onInit(){
		this.store = C.createStore('Surging',surging_store_config);
	}
	onLocationServiceReady(location_service){
		location_service.store.listen((action,store) => {
			if(action == 'change'){
				this.onLocationChange(store);
			}
		});

		this.initService(location_service.store);
	}
	onLocationChange(store){
		this.initService(store);
	}
	initService(location_store){
		var service = location_store.getBindableServices('surging');

		if(service && service[0]){
			this.store.set({
				service:service[0]
			});
		}else{
			this.store.set({
				service:null
			});
		}
	}
	show(){
		var service = this.store.get('service');

		return service.init();
	}
	onBanishBot(item){
		var service = this.store.get('service');

		C.lock({
			text:'Изгоняю...'
		});

		service.command('banish_bot',{
			ekey:item.entry
		}).then((json) => {
			GlobalActions.log(json.stuffs);
			C.unlock();
		}).catch(() => {
			C.unlock();
		})
	}
	onAttackBot(item){
		var service = this.store.get('service');

		C.lock({
			text:'Нападаю...'
		});

		service.command('battle_bot_surging',{
			ekey:item.entry
		}).then((json) => {
			GlobalActions.showBattle();
			C.unlock();
		}).catch(() => {
			C.unlock();
		})
	}
};

export default Module;