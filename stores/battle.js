import C from '../engine/c.js';
import GlobalActions, { BattleActions } from '../engine/actions.js';
import battleavatar_config from './battleavatar';

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
	getUser() {
		var state = this.get('state'),
			user = state.user;

		if(user && user.battle){
			return user;
		}else{
			let list = this.get('list'),
				user_store = C.getStore('User');

			for(let i = 0; i < list.length; i++){
				let el = list[i];
	
				if(el.display_title == user_store.get('display_title')){
					state.user = el;

					return el;
				}
			}
		}
	},
	clear(){
		var list = this.get('list') || [],
			state = this.get('state') || {},
			slots = this.get('slots') || {},
			preload_changes = this.get('preload_changes') || [],
			delayed_changes = this.get('delayed_changes') || {},
			pairs = this.get('pairs') || {},
			ekey_map = this.get('ekey_map') || {};

		this.set({
			list:list,
			state:state,
			slots:slots,
			preload_changes:preload_changes,
			delayed_changes:delayed_changes,
			pairs:pairs,
			ekey_map:ekey_map
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
	delayChanges(data){
		if(!data.list) return;

		var delayed_changes = this.get('delayed_changes');

		for(let ekey in data.list){
			if(delayed_changes[ekey]){
				let changes = delayed_changes[ekey];

				if(changes.timed && data.list[ekey].timed){
					Object.assign(changes.timed,data.list[ekey].timed);
				}

				Object.assign(delayed_changes[ekey],data.list[ekey]);
			}else{
				delayed_changes[ekey] = Object.assign({},data.list[ekey]);
			}
		}

		this.set({
			delayed_changes:delayed_changes
		});
	},
	applyDelayedChanges(ekey){
		var delayed_changes = this.get('delayed_changes');

		if(ekey){
			let changes = delayed_changes[ekey];

			if(changes){
				let list = {};

				list[ekey] = changes;

				this._applyChanges({
					list:list
				});

				delete delayed_changes[ekey];
			}
		}else{
			this._applyChanges({
				list:delayed_changes
			});

			this.set({
				delayed_changes:{}
			});
		}
	},
	/**
	 * Во время анимации ударов нельзя накатывать изменения, в которых карта умирает (ломается интерфейс),
	 * поэтому если кто-то умер - нужно запустить анимацию, а изменения уже накатить позже
	 * @param {String} ekey 
	 */
	applyChangesWhileAnimating(ekey){
		var changes = this.get('delayed_changes')[ekey];

		if(
			changes && 
			(
				(changes.timed && changes.timed.hp[0] == 0) ||
				changes.died == 1
			)
		){
			let slots = this.get('slots').slots,
				side, slot;

			for(let s in slots){
				let sl = slots[s];

				for(let slot_id in sl){
					if(sl[slot_id] == ekey){
						side = s;
						slot = slot_id;
						break;
					}
				}

				if(side) break;
			}

			this.trigger('remove_from_slot',{
				side:side,
				slot:slot
			})
		}else{
			this.applyDelayedChanges(ekey);
		}
	},
	_applyChanges(data,silent){
		var list = this.get('list');

		if(!list || !list.length || !data.list) return;

		/***/ GlobalActions.log('Накладываю изменения игроков', Object.keys(data.list));

		for(let i = 0; i < list.length; i++){
			let user = list[i],
				changes = data.list[user.battle.ekey],
				to_set = {};

			if(!changes) continue;

			if (changes.timed) {
				// в изменениях timed приходят частично, поэтому нельзя накатить напрямую changes.timed
				Object.assign(user.timed, changes.timed);
				to_set.timed = user.timed;
			}

			if (changes.aura) {
				if(user.aura){
					user.aura.splice(0);
					Array.prototype.push.apply(user.aura,changes.aura);
				}else{
					user.aura = changes.aura;
				}

				to_set.aura = user.aura;
			}

			if (changes.stats) {
				Object.assign(user.stats.stats, changes.stats);

				to_set.stats = user.stats;
			}

			if (changes.died == "1") {
				user.battle.live = 0; // выставляю признак что убит
				
				if(user.timed && user.timed.hp && user.timed.shield){// если не невидимка
					user.timed.hp[0] = 0; // обнуляю вручную hp когда мёртв
					user.timed.shield[0] = 0; // обнуляю вручную shield когда мёртв
				}

				to_set.died = 1;
				to_set.battle = user.battle;
				to_set.timed = user.timed;
			}

			if (changes.shape) {
				user.shape = changes.shape;
				to_set.shape = user.shape;
			}

			let battleavatar = this.get('ekey_map')[user.battle.ekey];

			if(battleavatar){
				battleavatar.set(to_set);
			}

			this.trigger('userchange',user);
		}
	},
	/**
	 * @param {Object} data - состояние боя после запроса после команды чата finish
	 */
	finishBattle(data){
		this.trigger('finish',this.store);

		// сброшу все баттлаватары
		this.set({
			ekey_map:{}
		});

		this.clear();
	},
	onSet(){
		/**
		 * Ничего не делаю с состоянием основных, если они не поменялись, кроме случая с новым раундом боя
		 */
		if(
			this.changed &&
			!this.changed.round && 
			this.changed.state && 
			this.changed.state.av_kick && 
			this.previous.state.av_kick
		){
			var changed = false;

			let new_kicks = this.changed.state.av_kick,
				prev_kicks = this.previous.state.av_kick;

			for(let i = 0; i < new_kicks.length; i++){
				if(new_kicks[i].name != prev_kicks[i].name){
					changed = true;
					break;
				}
			}

			if(changed){
				this.trigger('turns_changed',this);
			}
		}else{
			this.trigger('turns_changed',this);
		}

		if(!this.changed || this.changed.list){
			let ekey_map = this.get('ekey_map');

			this.get('list').forEach((el) => {
				if(ekey_map[el.battle.ekey]){
					let store = ekey_map[el.battle.ekey];

					store.set(Object.assign({},el));
				}else{
					ekey_map[el.battle.ekey] = C.createStore(el.battle.ekey,battleavatar_config);
					ekey_map[el.battle.ekey].set(Object.assign({},el));
				}
			});
		}
	},
	/**
	 * Вызывается при получении сообщения из чата с типом meddle
	 * компонент Slots реагирует на событие и рисует "прилет" карты в слот
	 * @param {*} user 
	 * @param {*} side 
	 * @param {*} slot 
	 */
	addInSlot(user,side,slot){
		let slots = this.get('slots').slots;

		if(!slots[side]){
			slots[side] = {};
		}

		slots[side][slot] = user.battle.ekey;

		this.set({
			slots:this.get('slots')
		});

		GlobalActions.log('New ekey',user.battle.ekey,' added in slot',slot);

		this.trigger('add_in_slot',user,side,slot);

		if(side == 1){
			BattleActions.event('bot_added_in_slot',user,slot);
		}
	},
	getRerollTurn(){
		var turns = this.get('state').av_kick,
			i = turns.length,
			reroll_name = C.refs.ref('constants|turn_reroll').value;

		while(i--){
			let turn = turns[i];

			if(turn.name == reroll_name){
				return turn;
			}
		}
	},
	canReroll(){
		var state = this.get('state');

		if(state.can_kick){
			let turn = this.getRerollTurn();
			
			if(turn && turn.priority != -1){
				return true;
			}else return false;
		}else return false;
	}
};

export default store;