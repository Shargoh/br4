import InAppBilling from "react-native-billing";
import GlobalActions from "../../engine/actions";
import { Alert } from 'react-native';
import { APP_NAME } from "../../constants/common";

const Payment = {
	buy(item){
		var id = String(item.entry),
			transaction;

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
			/**
				productId: String
				orderId: String
				purchaseToken: String
				purchaseTime: String
				purchaseState: String ("PurchasedSuccessfully", "Canceled", "Refunded", "SubscriptionExpired")
				receiptSignature: String
				receiptData: String
				autoRenewing Boolean
				developerPayload: String
			 */

			transaction = transaction_status;

			GlobalActions.log('Transaction Status',transaction_status);
		}).then(() => {
			return InAppBilling.consumePurchase(id);
		}).then(() => {
			return InAppBilling.close();
		}).then(() => {
			return {
				'receipt-data':JSON.stringify({
					packageName:APP_NAME,
					productId:transaction.productId,
					purchaseToken:transaction.purchaseToken,
					orderId:transaction.orderId
				})
			}
		}).catch((error) => {
			GlobalActions.error('buy product error: ',error);
			throw new Error();
		});
	},
	getProducts(ids){
		var products;

		return InAppBilling.close().then(() => {
			return InAppBilling.open();
		}).then(() => {
			return InAppBilling.getProductDetailsArray(ids);
		}).then((data) => {
			products = data;
			return InAppBilling.close();
		}).then(() => {
			if(products){
				let prepared = [];

				products.forEach((product) => {
					/**
						productId: String
						title: String
						description: String
						isSubscription: Boolean
						currency: String (RUB)
						priceValue: Double
						priceText: String
					 */
					prepared.push({
						price:product.priceValue,
						localizedPrice:product.priceText,
						productId:product.productId,
						currency:product.currency,
						title:product.title
					});
				});

				products = prepared;
			}

			return products;
		}).catch((error) => {
			GlobalActions.error('getProducts error: ',error);
			return [];
		});
	}
}

export default Payment;