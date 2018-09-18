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
						if(error){
							GlobalActions.error('IOS buy product error: ',id,error);
							reject(error);
								// NOTE for v3.0: User can cancel the payment which will be available as error object here.
						}else if(response && response.productIdentifier) {
							GlobalActions.log('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
							//unlock store here.
							resolve(response);
						}else{
							GlobalActions.error('IOS buy product unknown error');
							reject(new Error());
						}
					});
				}
			});
		});
	},
	getProducts(ids){
		var products;

		return new Promise((resolve,reject) => {
			InAppUtils.loadProducts(ids,(error,data) => {
				if(error){
					GlobalActions.error('IOS getProducts error:',error);
				}else{
					products = [];

					/**
						identifier	string	The product identifier
						price	number	The price as a number
						currencySymbol	string	The currency symbol, i.e. "$" or "SEK"
						currencyCode	string	The currency code, i.e. "USD" of "SEK"
						priceString	string	Localised string of price, i.e. "$1,234.00"
						countryCode	string	Country code of the price, i.e. "GB" or "FR"
						downloadable	boolean	Whether the purchase is downloadable
						description	string	Description string
						title	string	Title string
					 */

					data.forEach((product) => {
						products.push({
							price:product.price,
							localizedPrice:product.priceString,
							productId:product.identifier,
							currency:product.currencyCode,
							title:product.title
						});
					});
				}

				resolve(products);
			});
		});
	}
}

export default Payment;