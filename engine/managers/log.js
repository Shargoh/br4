import C from '../c.js';
import Manager from './proto.js';
import Reflux from 'reflux';

class LogManager extends Manager{
	constructor(){
		super();
		
		this.type = 'log';

		function log(type,args,extra){
			var arr = [type];
			Array.prototype.push.apply(arr,args);
			Array.prototype.push.apply(arr,extra);
			console.log.apply(console,arr);
		}
		
		Reflux.ListenerMethods.listenTo(GlobalActions.error,function(error){
			log('ERROR',arguments);
			// throw error;
		});

		Reflux.ListenerMethods.listenTo(GlobalActions.log,function(){
			// log('LOG',arguments);
		});

		Reflux.ListenerMethods.listenTo(GlobalActions.warn,function(){
			log('WARN',arguments);
		});
	}
};

export default LogManager;