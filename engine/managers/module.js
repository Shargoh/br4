import Manager from './proto.js';
import AccountsModule from '../../modules/accounts.js';
import StateModule from '../../modules/state.js';
import LocationModule from '../../modules/location.js';
import SurgingModule from '../../modules/surging.js';
import ChatConnection from '../../modules/chat_connection.js';
import User from '../../modules/user.js';
import Battle from '../../modules/battle.js';
import BattleResult from '../../modules/battle_result.js';
import Inventory from '../../modules/inventory';
import Shop from '../../modules/shop';

class ModuleManager extends Manager{
	constructor(){
		super();
		this.type = 'module';
		this.modules = {};
	}
	init(){
		var modules = [
				Inventory,
				Shop,
				LocationModule,
				AccountsModule,
				SurgingModule,
				Battle,
				BattleResult,
				ChatConnection,
				User,
				StateModule //ВАЖНО! в конце (первый загружается)
			],
			i = modules.length,
			mod;

		while(i--){
			mod = this._initModule(modules[i]);
			this.modules[mod.name] = mod;
		}
	}
	_initModule(M){
		var m = new M();
		m.init();
		return m;
	}
};

export default ModuleManager;