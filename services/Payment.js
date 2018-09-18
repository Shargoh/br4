/**
 *  Cервис платежей

 */
import Base from './Base.js';
import payment from '../utils/payment/android';
import request from '../utils/request.js';
import { IS_TEST } from '../constants/common.js';

const cached = {};

export default class Payment extends Base{
	static isSingle(){
		return true;
	}
	getProducts(){
		var ids = [];

		this.store.get('payment_preset').forEach((item) => {
			if(item.appstore_data) return;

			if(cached[item.entry]){
				item.appstore_data = cached[item.entry];
				return;
			}

			ids.push(String(item.entry));
		});

		return payment.getProducts(ids).then((products) => {
			/**
			 * {
			 * 	price
			 * 	localizedPrice
			 * 	productId
			 * 	currency - currency code!
			 * 	title
			 * }
			 */
			var items = this.store.get('payment_preset'),
				map = {};

			items.forEach((item) => {
				map[item.entry] = item;
			});
			
			products.forEach((el) => {
				if(!cached[el.productId]){
					cached[el.productId] = el;
				}

				if(map[el.productId]){
					map[el.productId].appstore_data = el;
				}
			});
		});
	}
	buy(item){
		return payment.buy(item).then((data) => {
			return this.validate(data,item);
		}).catch((error) => {
			// значит просто платеж не прошел
		});
	}
	validate(data,item){
		return request('mobile_pay','mobile_purchase',{
			data:JSON.stringify(data),
			add_data:JSON.stringify({
				af_revenue:Number(item.count),
				af_currency:item.appstore_data.currency,
				af_content_id:item.entry
			}),
			test:Number(IS_TEST)
		});
		// TODO track appsflyer
	}
}