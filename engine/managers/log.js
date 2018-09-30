import C from '../c.js';
import Manager from './proto.js';
import Reflux from 'reflux';
import react from 'react';
import { Alert } from 'react-native';
import { IS_TEST } from '../../constants/common.js';

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
			if(IS_TEST){
				let args = [],
					i = arguments.length;

				while(i--){
					let arg = arguments[i];

					if(typeof arg == 'string'){
						args.unshift(arg);
					}else if(arg && arg.stack){
						args.unshift(arg.stack);
						args.unshift(arg.toString());
					}else if(arg && arg.toString){
						args.unshift(arg.toString());
					}
				}

				let title = args[0],
					text = args.slice(1).toString();

				Alert.alert(title,text);
			}
		});

		Reflux.ListenerMethods.listenTo(GlobalActions.log,function(){
			if(IS_TEST){
				log('LOG',arguments);
			}
		});

		Reflux.ListenerMethods.listenTo(GlobalActions.warn,function(){
			if(IS_TEST){
				log('WARN',arguments);
			}
		});
	}
};

export default LogManager;