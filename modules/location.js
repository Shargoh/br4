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
};

export default Module;