/**
 *  Cервис локации

	Команды:
		banish_quest_bot
		attack_quest_bot

 */
import Base from './Base.js';
import inventory_store_config from '../stores/inventory';

export default class Inventory extends Base{
	getStoreConfig(){
		return inventory_store_config;
	}
}