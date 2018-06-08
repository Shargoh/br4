import C from '../engine/c.js';

const store = {
    /**
	 * Вернёт сервисы, привязанные к локации по названию прототипа.
	 */
	getBindableServices(name){
		var blob = this.get('blob'),
			objects = blob ? blob.objects || [] : [],
			services = [],
			ServiceManager = C.getManager('service');

		for (let i = 0; i < objects.length; i++) {
			let client_action = objects[i].client_action;

			if (client_action && client_action.id) {
				let service = ServiceManager.factory(objects[i].client_action.id);
				
				if (service && service.info.proto.package == name) {
					services.push(service);
				}
			}
		}

		return services;
	}
};

export default store;