import { NativeModules } from 'react-native';
import GlobalActions from "../../engine/actions";
import { Alert } from 'react-native';

const { InAppUtils } = NativeModules;

const Payment = {
	buy(item){
		var id = String(item.entry);

		return new Promise((resolve,reject) => {
			InAppUtils.canMakePayments((can_make_payments) => {
				if(!can_make_payments) {
					Alert.alert(
						'Not Allowed',
						'This device is not allowed to make purchases. Please check restrictions on device'
					);
					reject(new Error());
				}else{
					InAppUtils.purchaseProduct(id, (error, response) => {
						// NOTE for v3.0: User can cancel the payment which will be available as error object here.
						if(response && response.productIdentifier) {
							// Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
							//unlock store here.
						}
					});
				}
			});
		});


		return InAppBilling.close().then(() => {
			return InAppBilling.open();
		}).then(() => {
			return InAppBilling.isPurchased(id);
		}).then((is_purchased) => {
			if(!is_purchased){
				return InAppBilling.purchase(id);
			}
		}).then((details) => {
			if(details){
				GlobalActions.log('Item purchased: ',details);
			}

			return InAppBilling.getPurchaseTransactionDetails(id);
		}).then((transaction_status) => {
			GlobalActions.log('Transaction Status',transaction_status);
		}).then(() => {
			return InAppBilling.consumePurchase(id);
		}).then(() => {
			return InAppBilling.close();
		}).catch((error) => {
			GlobalActions.error('buy product error: ',error);
			throw new Error();
		});
	},
	getProducts(ids){
		var products;

		return new Promise((resolve,reject) => {
			InAppUtils.loadProducts(ids,(error,data) => {
				if(error){
					GlobalActions.error('IOS getProducts error:',error);
				}else{
					products = data;

					products.forEach((product) => {
						Alert.alert(JSON.stringify(product));
					});
				}

				resolve(products);
			});
		});
	}
}

export default Payment;