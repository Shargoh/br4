import C from '../engine/c.js';
import Proto from '../engine/proto_module.js';
import accounts_store_config from '../stores/accounts.js';
import { AsyncStorage } from 'react-native';
import GlobalActions from '../engine/actions.js';

class Module extends Proto{
	constructor(){
		super();
		this.name = "Accounts";
		this.store = C.createStore('Accounts',accounts_store_config);
		this.app_store = C.getStore('AppStore');
	}
	init(){
		AsyncStorage.getItem('accounts').then((accounts) => {
			if(accounts){
				accounts = JSON.parse(accounts);

				this.store.set({
					accounts:accounts
				});

				if(accounts.length){
					this.app_store.set({
						state:2
					});
				}

				C.unlock();
			}else{
				C.unlock();
			}
		}).catch(function(error){
			GlobalActions.error(error);
			C.unlock();
		});
	}
	onAddAccount(data){
		var accounts = this.store.get('accounts');

		accounts.push(data);

		AsyncStorage.setItem('accounts',JSON.stringify(accounts)).then(() => {
			this.store.set({
				accounts:accounts
			});

			this.app_store.set({
				state:2
			});
		}).catch((error) => {
			GlobalActions.error(error);
		})
	}
	onDeleteAccount(data){
		var accounts = this.store.get('accounts'),
			i = accounts.length;

		while(i--){
			let account = accounts[i];

			if(account.email == data.email) break;
		}

		if(i >= 0){
			accounts.splice(i,1);

			AsyncStorage.setItem('accounts',JSON.stringify(accounts)).then(() => {
				this.store.set({
					accounts:accounts
				});
	
				this.app_store.set({
					state:accounts.length ? 2 : 1
				});
			}).catch((error) => {
				GlobalActions.error(error);
			})
		}
	}
};

export default Module;