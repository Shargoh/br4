import C from '../engine/c.js';

const store = {
	getBattle: function() {
		var binding = this.get('binding');

		if(!binding) return 0;

		return Number(binding.battle);
	}
};

export default store;