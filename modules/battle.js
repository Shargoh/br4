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
			param;
console.log(name,state)
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

		if(info.is_slot){
			if(!slot){
				this.selecting = {
					name:name,
					cmp:turn_cmp
				};
				return Promise.resolve();
			}else{
				param = slot;
			}
		}

		GlobalActions.log('Kick!',name);

		this.store.trigger('before_'+event,this.store);

		return this.request('battle_kick',{
			kick:name,
			round:state.round,
			param:param
		}).then((json) => {
			GlobalActions.log('Kicked!',json);

			this.store.trigger(event,this.store);

			if(param){
				console.log(param)
				return turn_cmp.animateCorrectSelection(param);
			}
		}).then(() => {
			// state.av_kick.splice(index,1);

			// if(param){
			// 	this.store.get('slots')['1'][param] = 
			// }
			return turn_cmp;
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
			this.doKick(this.selecting.name,this.selecting.cmp,slot_id).then((turn_cmp) => {
				delete this.selecting;
			}).catch(() => {
				delete this.selecting;
			});
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

				this.store.set({
					pairs:data.pairs
				});
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
};

export default Module;