/**
 *  Cервис набеганий

	Команды:
		banish_bot
		battle_bot_surging

 */
import Base from './Base.js';

export default class Shop extends Base{
	static isSingle(){
		return false;
	}
	getStoreConfig(){
		return {
			beforeSet(data){
				var items = [],
					item_ids = [];

				if(data.shops){
					data.shops.forEach((shop) => {
						shop.items.forEach((item) => {
							let item_id = item.item.item;//Lol

							if(item_id && item_ids.indexOf(item_id) == -1){
								item_ids.push(item_id);
							}

							items.push(item);
						});
					});

					data.items = items;
					data.item_ids = item_ids;
				}
			}
		}
	}
}