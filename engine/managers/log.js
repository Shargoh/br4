import C from '../c.js';
import Manager from './proto.js';
import Reflux from 'reflux';
import react from 'react';
import { Alert, Platform } from 'react-native';
import { IS_TEST, AMPLITUDE_KEY, AF_DEV_KEY, APPLE_ID } from '../../constants/common.js';
import RNAmplitude from 'react-native-amplitude-analytics';
import appsFlyer from 'react-native-appsflyer';

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

		var af_initialized = false;

		if(RNAmplitude){
			this.amplitude = new RNAmplitude(AMPLITUDE_KEY);
		}

		const af_options = {
			devKey: AF_DEV_KEY,
			isDebug: IS_TEST
		};
			
		if (Platform.OS === 'ios') {
			af_options.appId = APPLE_ID;
		}
			
		if(appsFlyer){
			appsFlyer.initSdk(af_options,(result) => {
				this.af_initialized = true;
				// appsFlyer.trackAppLaunch();
			},(error) => {
				GlobalActions.error(error);
			});
		}

		Reflux.ListenerMethods.listenTo(GlobalActions.logEvent,(data) => {
			if(data.am){
				this.logAmplitude(data.am);
			}

			if(data.af){
				this.logAppsflyer(data.af);
			}
		});
	}
	logAmplitude(data){
		if(this.amplitude){
			let params = data.data || data,
				method = data.method || 'logEvent';

			if(Array.isArray(params)){
				this.amplitude[method].apply(this.amplitude,params);
			}else{
				this.amplitude[method](params);
			}
		}
	}
	logAppsflyer(data){
		// if(this.af_initialized){
		// 	let params = data.data || data,
		// 		method = data.method || 'trackEvent';

		// 	if(Array.isArray(params)){
		// 		appsFlyer[method].apply(appsFlyer,params);
		// 	}else{
		// 		appsFlyer[method](params);
		// 	}
		// }
	}
};

export default LogManager;