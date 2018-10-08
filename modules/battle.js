import C from '../engine/c.js';
import Reflux from 'reflux';
import Proto from '../engine/proto_module.js';
import battle_store_config from '../stores/battle.js';
import GlobalActions, { BattleActions } from '../engine/actions.js';
import request from '../utils/request.js';

const TESTING_ANIMATION = true;

class Module extends Proto{
	constructor(){
		super();
		this.name = "Battle";
	}
	onInit(){
		var me = this;

		this.store = C.createStore('Battle',battle_store_config);
		// Reflux.ListenerMethods.listenTo(GlobalActions.updateLocation,(data) => {
		// 	this.updateLocation(data);
		// });
		Reflux.ListenerMethods.listenTo(BattleActions.event,function(){
			me.onEvent.apply(me,arguments);
		});

		this.listenTo(BattleActions.reroll,'doReroll');
		this.listenTo(BattleActions.kick,'doKick');
		this.listenTo(BattleActions.prep,'doPrep');
	}
	show(){
		this.loadStart().then((json) => {
			if(!json.battle_is_done){
				GlobalActions.state(4);
				C.unlock();
			}
		})
	}
		/**
	 * Подгружает данные боя. Генерирует события: 'load_start' и 'start' или 'finish'
	 */
	loadStart(){
		this.store.clear();

		/***/ GlobalActions.log('Подгружаю данные боя');

		this.store.trigger('load_start',this.store);

		return this.request('battle_list').then((json) => {
			if(json.battle_is_done){
				return json;
			}

			var hints = {};

			if(json.hints && json.hints.length){
				for(let i = 0; i < json.hints.length; i++){
					let hint = json.hints[i];

					hints[hint.key] = hint.hint;
				}
			}

			this.store.set({
				pairs:json.pairs,
				slots:json.slots,
				list:json.list,
				hints:hints,
				started:true,
				battle_type:json.battle_type
			});
			this.store.applyPreloadChanges();

			this.store.trigger('start',this.store);

			return json;
		});
	}
		/**
	 * @private Подгружает результат. Генерирует событие "load_finish" и "finish"
	 */
	loadFinish(){
		this.store.trigger('load_finish',this.store);

		return this.reloadState().then((json) => {
			this.store.trigger('finish',this.store);

			return json;
		});
	}
		/**
	 * @private
	 * Подгружает данные раунда. События - 'load_round', 'round' или 'finish'
	 */
	loadRound(round_num){
		/***/	GlobalActions.log('Подгружаю данные раунда #', round_num);

		this.store.set({
			round:round_num
		});

		this.store.trigger('load_round',this.store);

		return this.reloadState().then((json) => {
			this.store.trigger('round',this.store);

			return json;
		});
	}
	/**
	 * Выполение базового действия. Coбытия 'before_kick', 'kick'
	 */
	doKick(name,turn_cmp,slot) {
		var state = this.store.get('state');

		if(!state.can_kick || !name){
			GlobalActions.warn("Can't kick :(");
			return Promise.resolve();
		}

		var info,
			index,
			event,
			param,
			target;

		for(let i = 0; i < state.av_kick.length; i++){
			let item = state.av_kick[i];

			if(item.name == name){
				index = 1;
				info = item;
				break;
			}
		}

		if(info && info.renew){
			event = 'reroll';
		}else{
			event = 'kick';
		}

		/**
		 * если действие - призвать бота в слот
		 */
		if(info.is_slot){
			if(!slot){
				this.selecting = {
					name:name,
					info:info,
					cmp:turn_cmp
				};
				return Promise.resolve();
			}else{
				param = slot;
			}
		}else if(slot == 100 || info.slot == 2){
			/**
			 * если действие на героя
			 */
			slot = 100;

			if(info.side == 1){
				target = state.user.battle.ekey;
			}else{
				let enemy = this.store.getEnemy();

				if(enemy){
					target = enemy.battle.ekey;
				}
			}
		}else{
			if(!slot){
				this.selecting = {
					name:name,
					info:info,
					cmp:turn_cmp
				};
				return Promise.resolve();
			}else{
				let hash = this.store.get('slots').slots[info.side];

				if(hash){
					target = hash[slot];
				}
			}
		}

		if(!target && !param && (info.slot == 1 || info.is_slot == 1)){
			GlobalActions.warn("Ability requires target :(");
			return Promise.resolve();
		}

		GlobalActions.log('Kick!',name);

		this.store.trigger('before_'+event,this.store);
		
		// анимирую сразу карту на место
		if(param || target){
			turn_cmp.animateCorrectSelection(slot,info.side);
		}

		return this.request('battle_kick',{
			kick:name,
			round:state.round,
			param:param,
			target:target
		}).then((json) => {
			GlobalActions.log('Kicked!',json);

			this.store.trigger(event,this.store);

			return turn_cmp;
		}).catch((error) => {
			turn_cmp.animateWrongDrop();

			GlobalActions.error('doKick error',error);
		});
	}
	/**
	 * Выполение моментального действия. Coбытия 'before_prep', 'prep'
	 */
	doPrep(prep) {
		return this.doClientBeforePrep(prep).then(() => {
			return this.selectTarget(prep);
		}).then((ekey) => {
			/***/ GlobalActions.log('Запрос на выполнение предварительного действия');
			// me.fireEvent('before_prep', me);
			// me.battleView.onBattleBeforePrep(me);
			return this.request('battle_instant',{
				kick: prep.name,
				target: ekey,
				round: this.store.get('round')
			});
		}).then((json) => {
			GlobalActions.log('Успешный запрос на выполнение предварительного действия',json);
		});
	}
	doClientBeforePrep(prep){
		// if (prepData.client) {
		// 	if (prepData.client == 'invite') {
		// 		me.app.getSocialController().invite(callback);
		// 	}
		// }
		// else {
		// 	callback();
		// }
		return Promise.resolve();
	}
	selectTarget(prep){
		// if (prepData.strike) {
		// 	ExGods.Components.factory('USER_TARGET_PANEL', {
		// 		windowTitle: refData.label,
		// 		source: 'battle',
		// 		side: prepData.strike.side == 0 ? user.getBattleSide() : 2,
		// 		dead: prepData.strike.is_dead,
		// 		listeners: {
		// 			select: function(wnd, rec) {
		// 				callback(rec.get('battle').ekey);
		// 				wnd.up().close();
		// 			}
		// 		}
		// 	});
		// }
		// else {
		// 	callback();
		// }
		return Promise.resolve();
	}
	/**
	 * "Реролл" доступных действий. Coбытия 'before_reroll', 'reroll'
	 */
	doReroll() {
		this.store.trigger('before_reroll',this.store);

		GlobalActions.log('Rerolling... round:',this.store.get('round'));

		return this.request('battle_reroll',{
			round:this.store.get('round')
		}).then((json) => {
			this.store.trigger('reroll',this.store);

			return json;
		});
	}
		/**
	 * @private Обновить состояние боя
	 */
	reloadState() {
		/****/ GlobalActions.log('Обновляю состояние боя');

		return this.request('battle_current');
	}
	request(cmd,data,options){
		if(TESTING_ANIMATION && cmd == 'battle_kick'){
			return Promise.resolve({
				success:1
			});
			// return Promise.reject('ERROR');
		}

		return request('battle',cmd,data,options).then((json) => {
			if (json && json.success) {
				if (json.buser && json.buser.user) {
					GlobalActions.setUser(json.buser.user);
				}
				
				var to_set;

				if (json.buser) {
					let round = Number(json.buser.round);

					if(this.store.get('round') > round){
						round = this.store.get('round');
					}

					if(!json.buser.av_kick){
						json.buser.av_kick = this.store.get('state').av_kick;
					}

					to_set = {
						state:json.buser,
						round:round
					};

					// if (json.buser.marks) {
					// 	/***/
					// 	me.fireEvent('apply_marks', json.buser.marks);
					// 	me.battleView.applyMarks(json.buser.marks);
					// }
				}

				if(json.slots){
					if(to_set){
						to_set.slots = json.slots;
					}else{
						to_set = {
							slots:json.slots
						}
					}
				}

				console.log(to_set);

				if(to_set){
					this.store.set(to_set);
				}
	
				if (json.battle_is_done) {
					GlobalActions.showModule('BattleResult');
				}else if (json.not_active_battle) {
					GlobalActions.showLocation();
				}else if (json.battle_not_start) {
					setTimeout(() => {
						this.request(cmd,data,options);	
					}, 2000);
				}

				return json;
			}else throw 'unsuccess';
		});
	}
	/**
	 * Перезагружает данные боя и обновляет отображение
	 */
	restartBattle() {
		this.loadStart();
	}
	onSelectSlot(slot_id){
		if(this.selecting){
			var info = this.selecting.info;

			if(!info.is_slot) return;

			this.doKick(this.selecting.name,this.selecting.cmp,slot_id).then((turn_cmp) => {
				delete this.selecting;
			}).catch(() => {
				delete this.selecting;
			});
		}
	}
	onSelectHero(is_enemy){
		if(this.selecting){
			var info = this.selecting.info;

			if(info.slot == 1) return;

			if(
				(info.side == 2 && is_enemy) ||
				!is_enemy
			){
				this.doKick(this.selecting.name,this.selecting.cmp,100).then((turn_cmp) => {
					delete this.selecting;
				}).catch(() => {
					delete this.selecting;
				});
			}
		}
	}
	onSelectTarget(slot_id,is_enemy){
		if(this.selecting){
			var info = this.selecting.info;

			if(Number(info.is_slot)) return;
			if(info.slot == 2) return;

			if(
				(info.side == 2 && is_enemy) ||
				!is_enemy
			){
				this.doKick(this.selecting.name,this.selecting.cmp,slot_id).then((turn_cmp) => {
					delete this.selecting;
				}).catch(() => {
					delete this.selecting;
				});
			}
		}
	}
	/**
	 * Обработка команд сервера
	 */
	commandBattleLog(data){
		/***/ GlobalActions.log('Сообщение лога боя с типом battle_log', data);

		switch (data.type) {
			case 'start':
				this.show();
				break;
			case 'meddle':
				if (!this.store.get('started')) {
					this.show();
				}else{
					let ekey = data.user.battle.ekey,
						list = this.store.get('list'),
						exists = false;

					for(let i = 0; i < list.length; i++){
						let member = list[i];

						if(member.battle.ekey == ekey){
							exists = true;
							break;
						}
					}

					if(!exists){
						list.push(data.user);

						if(data.slot && data.side){
							this.store.addInSlot(data.user,data.side,data.slot);
						}

						this.store.set({
							list:list
						});
					}
				}
				// TODO добавление юзеров вроде работает, но не работает updateTitles - на будущее надо ввести
				// else if (!me.list.getByKey(data.user.battle.ekey)) {
				// 	me.list.add(data.user.battle.ekey, data.user);
				// 	/***/
				// 	me.fireEvent('u_add', data.user);
				// 	me.battleView.onBattleUserAdd(data.user);

				// 	if (data.user.is_bot) {
				// 		me.ekeys.push(data.user.battle.ekey);
				// 		me.updateTitles();
				// 	}
				// }
				break;
			case 'resurect':
				// me.resurectUser(data);
				break;
			case 'finish':
				this.loadFinish();
				break;
			case 'newround':
				if (data.round != 1) {
					this.loadRound(data.round);
				}

				var to_set = {
					pairs:data.pairs
				}

				if (data.slots) {
					let slots = this.store.get('slots');

					if(slots){
console.log('S_L_O_T_S',data.slots);

						slots.slots = data.slots;
						to_set.slots = slots;
					}
				}

				this.store.set(to_set);
				break;
			case 'exit':
				// if (me.started && me.list.getByKey(data.user.battle.ekey)) {
				// 	me.list.remove(data.user.battle.ekey);
				// 	/***/
				// 	me.fireEvent('u_remove', data.user);
				// 	me.battleView.onBattleUserRemove(data.user);
				// }
				break;
			case 'changes':
				this.store.applyChanges(data);
				break;
		}

		// отлавливаю основные действия юзера и врага и генерирую события "user_kick", "enemy_kick"
		// if (me.state.live != "0" && data.turn_name) {
		// 	var u = data.u || data.u1,
		// 		enemyBattleEkey = me.state.enemy;
		// 	if (u && u[2] == me.user.getBattleEkey()) {
		// 		/***/
		// 		me.fireEvent('user_kick', data.turn_name);
		// 		me.battleView.onBattleUserKick(data.turn_name);
		// 	}
		// 	else if (u && enemyBattleEkey && u[2] == enemyBattleEkey) {
		// 		/***/
		// 		me.fireEvent('enemy_kick', data.turn_name);
		// 		me.battleView.onBattleEnemyKick(data.turn_name);
		// 	}
		// }
	}
	commandBattleChanges(data){
		/***/ GlobalActions.log('Сообщение battle_changes', data);
		
		// if(data.effect && data.effect.changes){
		// 	let list = [];
			
		// 	list[me.user.getBattleEkey()] = data.effect.changes;
			
		// 	me.onBattleLogMessage(null, {
		// 		body:{
		// 			data:{
		// 				type:'changes',
		// 				list:list
		// 			}
		// 		}
		// 	});
		// }
	}
	commandBuser(data){
		return this.reloadState();
	}
	commandBattleExit(data){
		GlobalActions.updateUser();
	}
	onTestEnemyAnimation(){
		// сначала сброшу слоты у противника
		this.store.trigger('remove_from_slot',null,2,1);
		this.store.trigger('remove_from_slot',null,2,2);
		this.store.trigger('remove_from_slot',null,2,3);
		this.store.trigger('remove_from_slot',null,2,4);
		this.store.trigger('remove_from_slot',null,2,5);

		setTimeout(() => {
			let ekey_map = this.store.get('ekey_map'),
				slots = this.store.get('slots').slots[2];

			for(let slot_id in slots){
				let user = ekey_map[slots[slot_id]];

				if(!user || slot_id > 5) continue;

				this.store.addInSlot(user,2,slot_id);
			}
		},500);
	}
	onEnemyAddedInSlot(user,slot){
		this.store.trigger('added_in_slot',user,2,slot);
	}
};

export default Module;