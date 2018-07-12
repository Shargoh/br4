import Reflux from 'reflux';
    
GlobalActions = Reflux.createActions([
	'setUser',
	'showAlert',
	'showModule',
	'updateLocation',
	'addChatMessage',
	'showReward',
	'moveMap',
	'closeWindows',
	'setInstanceAims',
	'showConfirm',
	'removeConfirm',
	'updateBattles',
	'init',
	'event',
	'printEvent',
	'error',
	'log',
	'warn',
	'initServices',
	'state',
	'userChanged',
	'showLocation',
	'showBattle',
	'updateUser',
	'initAnimations'
]);

export const ChatConnectionActions = Reflux.createActions([
	'beforeConnect',
	'connect',
	'presenceError',
	'presenceUnavail',
	'presenceAvail',
	'presenceInit',
	'ready',
	'message',
	'messageCommand',
	'messageDefault',
	'ping'
]);

export const BattleActions = Reflux.createActions([
	'reroll',
	'kick',
	'prep'
]);

export default GlobalActions;