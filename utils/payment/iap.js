import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

let _connected = false;

const itemSkus = Platform.select({
  ios: [
    'com-okg-timetocardstest'
  ],
  android: [
    'com.br4'
  ]
});

const Payment = {
	connect(){
		if(_connected){
			return Promise.resolve();
		}else{
			return RNIap.initConnection().then(() => {
				_connected = true;
			});
		}
	},
	buy(item){
		return this.connect().then(() => {
			return RNIap.buyProduct(item.entry);
		})
	},
	getProducts(ids){
		return this.connect().then(() => {
			return RNIap.getProducts(ids || itemSkus);
		});
	}
}

export default Payment;