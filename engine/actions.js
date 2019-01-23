import Reflux from 'reflux';
    
GlobalActions = Reflux.createActions([
	'setUser',
	'showAlert',
	'showModule',
	'updateLocation',
	'showReward',
	'closeWindows',
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
	'window',
	'userChanged',
	'showLocation',
	'showBattle',
	'updateUser',
	'initAnimations',
	'logEvent'
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
	'prep',
	'event'
]);

export const InventoryActions = Reflux.createActions([
	'event'
]);

export const ShopActions = Reflux.createActions([
	'event'
]);

export const LocationActions = Reflux.createActions([
	'event'
]);

export default GlobalActions;