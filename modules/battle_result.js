import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import battle_result_store_config from '../stores/battle_result.js';
import GlobalActions from '../engine/actions.js';
import request, { baseRequest } from '../utils/request.js';

class Module extends Proto{
	constructor(){
		super();
		this.name = "BattleResult";
	}
	onInit(){
		this.store = C.createStore('BattleResult',battle_result_store_config);
	}
	show(){
		// this.loadBattleResult(function(result) {
		// 	delete me.started;
		// 	me.result = result;
		// 	me.battle_type = 0;
		// 	/***/
		// 	me.fireEvent('finish', me, me.result);
		// 	me.battleView.onBattleFinish(me, me.result);
		// });
		return this.loadBattleResult().then((data) => {
			GlobalActions.log(data);
			GlobalActions.showLocation();
		});
	}
	/**
	 * Подгрузка данных боя
	 * @param force true - запрашивать, даже если уже была попытка запроса
	 */
	loadBattleResult(force) {
		if (!force && this.result_loading) {
			return Promise.resolve(); // чтобы не запрашивать дважды
		}

		this.result_loading = true;

		return request('battle','battle_result').then((json) => {
			if (!json || !json.success) {
				// данные уже запрошены ранее, или ошибка сервера
				return;
			}else if (json.battle_in_finish || json.battle_not_start) {
				return new Promise((resolve,reject) => {
					setTimeout(() => {
						this.loadBattleResult(true).then(resolve).catch(reject);
					}, 5000);
				});
			}else return json.battle_result;
		}).then(() => {
			this.result_loading = false;
		})
	}
};

export default Module;