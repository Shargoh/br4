import C from '../engine/c.js';
import GlobalActions from '../engine/actions.js';

const store = {
	/**
	 * Вернёт данные текущего противника
	 */
	getEnemy() {
		var enemy = this.get('state').enemy,
			list = this.get('list');

		for(let i = 0; i < list.length; i++){
			let el = list[i];

			if(el.battle.ekey == enemy){
				return el;
			}
		}
	},
	clear(){
		this.set({
			list:[],
			state:{},
			slots:{},
			preload_changes:[],
			pairs:{},
			ekey_map:{}
		});
	},
	applyChanges(data){
		if(this.get('started')){
			this._applyChanges(data);
		}else{
			let preload_changes = this.get('preload_changes') || [];

			preload_changes.push(data);

			this.set({
				preload_changes:preload_changes
			});
		}
	},
	applyPreloadChanges(){
		// накатываю изменения, которые пришли до подгрузки списка
		var preload_changes = this.get('preload_changes');

		if(preload_changes && preload_changes.length){
			for(let i = 0; i < preload_changes.length; i++){
				let changes = preload_changes[i];

				this._applyChanges(changes,true);
			}
		}
	},
	_applyChanges(data,silent){
		/***/ GlobalActions.log('Изменения', data);

		var list = this.get('list');

		if(!list || !list.length || !data.list) return;

		for(let i = 0; i < list.length; i++){
			let user = list[i],
				changes = data.list[user.battle.ekey];

			if(!changes) continue;

			if (changes.timed) {
				Object.assign(user.timed, changes.timed); // в изменениях timed приходят частично, поэтому нельзя накатить напрямую changes.timed
			}

			if (changes.aura) {
				if(user.aura){
					user.aura.splice(0);
					Array.prototype.push.apply(user.aura,changes.aura);
				}else{
					user.aura = changes.aura;
				}
			}

			if (changes.stats) {
				Object.assign(user.stats.stats, changes.stats);
			}

			if (changes.died == "1") {
				user.battle.live = 0; // выставляю признак что убит
				
				if(user.timed && user.timed.hp && user.timed.shield){// если не невидимка
					user.timed.hp[0] = 0; // обнуляю вручную hp когда мёртв
					user.timed.shield[0] = 0; // обнуляю вручную shield когда мёртв
				}
			}

			if (changes.shape) {
				user.shape = changes.shape;
			}

			this.trigger('userchange',user);
		}
	},
	onSet(){
		if(this.changed && this.changed.state && this.changed.state.av_kick && this.previous.state.av_kick){
			var changed = false;

			let new_kicks = this.changed.state.av_kick,
				prev_kicks = this.previous.state.av_kick;

			for(let i = 0; i < new_kicks.length; i++){
				if(new_kicks[i].name != prev_kicks[i].name){
					changed = true;
					break;
				}
			}

			if(!changed){
				delete this.changed.state.av_kick;
			}
		}

		if(!this.changed || this.changed.list){
			let ekey_map = this.get('ekey_map');

			this.get('list').forEach((el) => {
				ekey_map[el.battle.ekey] = el;
			});
		}
	}
};

export default store;