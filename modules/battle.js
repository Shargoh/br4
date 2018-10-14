import C from '../engine/c.js';
import Reflux from 'reflux';
import Proto from '../engine/proto_module.js';
import battle_store_config from '../stores/battle.js';
import GlobalActions, { BattleActions } from '../engine/actions.js';
import request from '../utils/request.js';
import { Alert } from 'react-native';

const TESTING_ANIMATION = false;

class Module extends Proto{
	constructor(){
		super();
		this.name = "Battle";
	}
	onInit(){
		var me = this;

		this.store = C.createStore('Battle',battle_store_config);
		this.user = C.getStore('User');
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
			turn_cmp.animateWrongDrop();
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
					param = slot;
				}
			}
		}

		if(!target && !param && (info.slot == 1 || info.is_slot == 1)){
			GlobalActions.warn("Ability requires target :(");
			turn_cmp.animateWrongDrop();
			return Promise.resolve();
		}

		GlobalActions.log('Kick:',name,'at round',state.round,'param:',param,'target:',target);

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
			if(json.success && !json.msg){
				GlobalActions.log('Kicked!',json);

				this.store.trigger(event,this.store);
				turn_cmp.animateKickSuccess();

				return turn_cmp;
			}else{
				throw json.msg;
			}
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
		var log_data = {};

		for(let key in data){
			if(typeof data[key] == 'object'){
				log_data[key] = 'OBJECT';
			}else{
				log_data[key] = data[key];
			}
		}

		/***/ GlobalActions.log('Сообщение лога боя с типом battle_log:',log_data.type, log_data);

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

					// интерфейс не предполагает больше 5 слотов
					if(data.slot > 5) break;

					for(let i = 0; i < list.length; i++){
						let member = list[i];

						if(member.battle.ekey == ekey){
							exists = true;
							break;
						}
					}

					if(!exists){
						// list.push(data.user);
						list = list.concat([data.user]);

						this.store.set({
							list:list
						});

						if(data.slot && data.side){
							this.store.addInSlot(data.user,data.side,data.slot);
						}
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
		if (data.turn_name) {
			let u = data.u || data.u1,
				ekey = this.user.get('battle').ekey,
				enemy = this.store.getEnemy();

			if(u && u[2] == ekey){
				/***/
				// значит мой удар. Но по идее я и так знаю что это мой удар на момент, когда за запрос
				// на battle_kick приходит success, поэтому тут ничего не делаю
			}else if(u && enemy && enemy.battle.ekey && u[2] == enemy.battle.ekey){
				// а вот тут надо проверить что за способность использовал противник и если это не карта в слот -
				// анимировать
				this.doEnemyKick(data);
			}
		}
	}
	doEnemyKick(data){
		var ref = C.refs.ref('battle_turn|'+data.turn_name),
			slots = this.store.get('slots').slots,
			line,
			slot;

		// карты, которые попадают в слоты, приходят в meddle - их тут отображать не нужно
		// ну или потом надо будет сделать какую-то доп. анимацию тут
		if(!ref || ref.is_slot == 1) return;

		if(!data.u2){
			line = 0;
			slot = 3;
		}else if(data.u2 && data.u2[0] == 1){
			// бьет моего
			for(let slot_id in slots[1]){
				let ekey = slots[1][slot_id];

				if(ekey == data.u2[2]){
					line = 2;
					slot = slot_id;
					break;
				}
			}

			if(!slot){
				// значит цель не в слоте, значит герой
				line = 3;
				slot = 3;
			}
		}else{
			// бьет своего
			for(let slot_id in slots[2]){
				let ekey = slots[2][slot_id];

				if(ekey == data.u2[2]){
					line = 1;
					slot = slot_id;
					break;
				}
			}

			if(!slot){
				// значит цель не в слоте, значит герой
				line = 0;
				slot = 3;
			}
		}

		this.store.trigger('enemy_kick',data.turn_name,line,slot);
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
	onBotAddedInSlot(user,slot){
		this.store.trigger('added_in_slot',user,1,slot);
	}
};

export default Module;