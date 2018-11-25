import C from '../engine/c.js';
import Reflux from 'reflux';
import Proto from '../engine/proto_module.js';
import battle_store_config from '../stores/battle.js';
import GlobalActions, { BattleActions } from '../engine/actions.js';
import request from '../utils/request.js';
import { Alert } from 'react-native';
import { calcActionDuration } from '../components/battle/EnemyTurn.js';
import { TEST_ANIM } from '../constants/common.js';

const ekey_priority = {},
	actions = [],
	first_delay = 500;

var _timeout,
	_doing_action = false;

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

			console.log(json.buser)

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
			this.store.finishBattle(json);

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
			/***/	GlobalActions.log('Данные раунда #', round_num, 'успешно загружены. Генерирую событие round');

			this.store.trigger('round',this.store);

			return json;
		});
	}
	/**
	 * Выполение базового действия. Coбытия 'before_kick', 'kick'
	 */
	doKick(name,turn_cmp,slot) {
		var state = this.store.get('state');

		this.onUnhighlightAvailableSlot();

		if(!state.can_kick || !name){
			GlobalActions.warn("Can't kick :(",state.can_kick,name);
			turn_cmp.animateWrongDrop();
			return Promise.resolve();
		}

		var round = state.round,
			info,
			event,
			param,
			target;

		for(let i = 0; i < state.av_kick.length; i++){
			let item = state.av_kick[i];

			if(item.name == name){
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

		GlobalActions.log('Kick:',name,'at round',round,'param:',param,'target:',target);

		this.store.trigger('before_'+event,this.store);
		
		// анимирую сразу карту на место
		if(param || target){
			turn_cmp.animateCorrectSelection(slot,info.side);
		}

		return this.request('battle_kick',{
			kick:name,
			round:round,
			param:param,
			target:target
		}).then((json) => {
			if(json.success && !json.msg){
				GlobalActions.log('Kicked!',name);

				this.store.trigger(event,this.store);
				turn_cmp.animateKickSuccess();

				GlobalActions.logEvent({
					am:{
						method:'logEvent',
						data:['kick',{
							kick:name,
							round:round,
							slot:param,
							target:target
						}]
					},
					af:{
						method:'trackEvent',
						data:['af_content_view',{
							af_content_type:'kick',
							af_content_id:name
						}]
					}
				})

				return turn_cmp;
			}else{
				throw json.msg;
			}
		}).catch((error) => {
			turn_cmp.animateWrongDrop();

			GlobalActions.error('doKick error. Kick:',name,'Slot:',param,'Target:',target,error);
		});
	}
	/**
	 * Выполение моментального действия.
	 */
	doPrep(prep_name) {
		return this.doClientBeforePrep(prep_name).then(() => {
			/***/ GlobalActions.log('Запрос на выполнение предварительного действия');
			return this.request('battle_instant',{
				kick: prep_name,
				round: this.store.get('round')
			});
		}).then((json) => {
			GlobalActions.log('Успешный запрос на выполнение предварительного действия',json);
		}).catch((error) => {
			GlobalActions.error('Ошибка запрос на выполнение предварительного действия',prep_name,error);
		});
	}
	doClientBeforePrep(prep_name){
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
	/**
	 * "Реролл" доступных действий. Coбытия 'before_reroll', 'reroll'
	 */
	doReroll() {
		this.store.trigger('before_reroll',this.store);

		GlobalActions.log('Rerolling... round:',this.store.get('round'));

		var turn = this.store.getRerollTurn(),
			state = this.store.get('state');

		if(turn){
			return this.request('battle_kick',{
				kick:turn.name,
				round:state.round
			}).then((json) => {
				if(json.success && !json.msg){
					GlobalActions.log('Rerolled!');
	
					this.store.trigger('reroll',this.store);
				}else{
					throw json.msg;
				}
			}).catch((error) => {
				GlobalActions.error('doReroll error',error);
			});
		}

		// return this.request('battle_reroll',{
		// 	round:this.store.get('round')
		// }).then((json) => {
		// 	this.store.trigger('reroll',this.store);

		// 	return json;
		// });
	}
		/**
	 * @private Обновить состояние боя
	 */
	reloadState() {
		/****/ GlobalActions.log('Обновляю состояние боя');

		return this.request('battle_current');
	}
	request(cmd,data,options){
		if(TEST_ANIM && cmd == 'battle_kick'){
			setTimeout(() => {
				this.store.trigger('round',this.store);
			},1000);

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
			if(typeof data[key] == 'object' && (key.charAt(0) != 'u' || key == 'user')){
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
							this.queueAction({
								priority:10 + Number(data.side),
								ekey:data.user.battle.ekey,
								callback:() => {
									this.store.addInSlot(data.user,data.side,data.slot);
								}
							})
							// this.store.addInSlot(data.user,data.side,data.slot);
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
				this.applyRoundData(data);
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
				if(this._doing_actions){
					this.store.delayChanges(data);
				}else{
					this.store.applyChanges(data);
				}
				break;
			case 'die':
				// дохлые бьют первым делом
				let list = {};

				list[data.u[2]] = {
					died:1
				};

				this.store.delayChanges({
					list:list
				});

				// this.queueAction({
				// 	priority:1,
				// 	ekey:data.u[2]
				// });
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
			}else if(u){
				this.doBotKick(data);
			}
		}
	}
	doEnemyKick(data){
		var ref = C.refs.ref('battle_turn|'+data.turn_name),
			u = data.u || data.u1,
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

		this.queueAction({
			priority:12,
			ekey:u[2],
			callback:() => {
				this.store.trigger('enemy_kick',data.turn_name,line,slot);
			},
			delay:calcActionDuration()
		})

		// this.store.trigger('enemy_kick',data.turn_name,line,slot);
	}
	doBotKick(data){
		var u = data.u || data.u1,
			side = Number(u[0]),
			slots = this.store.get('slots').slots[side],
			priority = 4;

		for(let slot_id in slots){
			if(slots[slot_id] == u[2]){
				priority += Number(slot_id);
				break;
			}
		}

		this.queueAction({
			priority:priority,
			ekey:u[2],
			callback:() => {
				return new Promise((resolve,reject) => {
					this.store.trigger('slot_kick',{
						data:data,
						side:side,
						resolve:resolve
					});
				});
			}
		});
	}
	/**
	 * В бою показываем все по порядку. Для этого передаем дату в виде:
	 * @param {Object} data 
	 * 	priority:{Number} - приоритет. Натуральное число. Чем выше - тем позже действие
	 * 	ekey:{String} - ekey исполнителя. Исполнители выполняют все свои действия сразу,
	 * 		используя наименьший приоритет для порядка.
	 * 	callback:{Function} - метод, который вызовется
	 * 	delay:{Number} - задержка перед следующим действием
	 */
	queueAction(data){
		var ekey = data.ekey;

		// добавим приоритет в список по ekey. Если такой ekey уже есть и приоритет ниже - заменим приоритет в дате.
		// если такой ekey уже есть и приоритет выше - заменим приоритет в списке
		if(ekey_priority[ekey] && ekey_priority[ekey] > data.priority){
			let priority_acts = actions[ekey_priority[ekey]],
				acts;

			if(priority_acts){
				acts = priority_acts[ekey];

				delete priority_acts[ekey];

				if(Object.values(priority_acts).length == 0){
					delete actions[ekey_priority[ekey]];
				}
			}

			if(!actions[data.priority]){
				let _acts = {};

				_acts[ekey] = acts || [];

				actions[data.priority] = _acts;
			}
		}else if(ekey_priority[ekey]){
			data.priority = ekey_priority[ekey];
		}else if(data.callback){
			ekey_priority[ekey] = data.priority;
		}

		GlobalActions.log('setting priority',data.priority,ekey);

		/**
		 * можно прислать дату без колбека чтобы пересортировать действия по приоритетам
		 */
		if(!data.callback) return;

		// добавим действие в список действие
		if(!actions[data.priority]){
			actions[data.priority] = {};
		}

		if(!actions[data.priority][data.ekey]){
			actions[data.priority][data.ekey] = [];
		}

		actions[data.priority][data.ekey].push(data);

		// first_delay
		if(_timeout){
			clearTimeout(_timeout);
		}

		_timeout = setTimeout(() => {
			this.doAction();
		},first_delay);
	}
	/**
	 * Выполняются все действия с одним приоритетом одновременно
	 */
	doAction(){
		var acts = [],
			delay = 0;

		if(this._doing_action) return;

		this._doing_action = true;
		this._doing_actions = true;

		for(let i = 0; i < actions.length; i++){
			if(!actions[i]) continue;

			for(let ekey in actions[i]){
				let arr = actions[i][ekey];

				if(!arr.length) continue;
				GlobalActions.log('doing priority',i,ekey);

				Array.prototype.push.apply(acts,arr);

				delete actions[i][ekey];
			}

			if(acts.length) break;
		}

		if(acts.length){
			let cb = () => {
				if(delay){
					setTimeout(() => {
						this._doing_action = false;
						this.doAction();
					},delay);
				}else{
					this._doing_action = false;
					this.doAction();
				}
			}

			let map = [];

			for(let i in acts){
				let action = acts[i];

				if(action.delay > delay){
					delay = action.delay;
				}

				if(!action.callback) continue;

				map.push(action.callback());
			}

			Promise.all(map).then(cb).catch(cb);
		}else{
			this._doing_action = false;
			this._doing_actions = false;
			this.store.applyDelayedChanges();
			this.applyRoundData(this._round_data);
		}
	}
	applyRoundData(data){
		if(this._doing_actions){
			this._round_data = data;
		}else this._applyRoundData(data);
	}
	_applyRoundData(data){
		data = data || this._round_data;

		delete this._round_data;

		if(!data) return;

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
		this.store.trigger('remove_from_slot',{
			side:2,
			slot:1
		});
		this.store.trigger('remove_from_slot',{
			side:2,
			slot:2
		});
		this.store.trigger('remove_from_slot',{
			side:2,
			slot:3
		});
		this.store.trigger('remove_from_slot',{
			side:2,
			slot:4
		});
		this.store.trigger('remove_from_slot',{
			side:2,
			slot:5
		});

		setTimeout(() => {
			let ekey_map = this.store.get('ekey_map'),
				slots = this.store.get('slots').slots[2];

			for(let slot_id in slots){
				let user = ekey_map[slots[slot_id]];

				if(!user || slot_id > 5) continue;

				this.store.addInSlot(user.attributes,2,slot_id);
			}
		},500);
	}
	onEnemyAddedInSlot(user,slot){
		this.store.trigger('added_in_slot',{
			user:user,
			side:2,
			slot:slot
		});
	}
	onBotAddedInSlot(user,slot){
		this.store.trigger('added_in_slot',{
			user:user,
			side:1,
			slot:slot
		});
	}
	onApplySlotChanges(ekey){
		// this.store.applyDelayedChanges(ekey);

		this.store.applyChangesWhileAnimating(ekey);
	}
	onHighlightAvailableSlot(kick,target_type){
		switch(target_type){
			case 1:
				this.store.trigger('hl_my_slots');
				break;
			case 3:
				this.store.trigger('hl_my_bots');
				break;
			case 2:
				this.store.trigger('hl_enemy_bots');
				break;
			case 4:
				this.store.trigger('hl_enemy_hero');
				break;
			case 5:
				this.store.trigger('hl_my_hero');
				break;
			case 6:
				this.store.trigger('hl_enemy_hero');
				this.store.trigger('hl_enemy_bots');
				break;
			case 7:
				this.store.trigger('hl_my_hero');
				this.store.trigger('hl_my_bots');
				break;
		}
	}
	onUnhighlightAvailableSlot(){
		this.store.trigger('unhl');
	}
};

export default Module;