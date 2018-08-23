import C from '../engine/c.js';
import { InventoryActions } from '../engine/actions.js';

const store = {
	getBattle: function() {
		var binding = this.get('binding');

		if(!binding) return 0;

		return Number(binding.battle);
	},
	beforeSet: function(data) {
		if(data.slots){
			InventoryActions.event('slots',data.slots);
		}
	},
	setSlots: function(slots){
		this.slots = {};

		var i = slots.length;

		while(i--){
			this.slots[slots[i].type] = slots[i];
		}

		InventoryActions.event('slots',data.slots);

		this.trigger('slots',this.slots);
	}
};

export default store;