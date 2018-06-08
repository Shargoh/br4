/**
 *  Cервис локации

	Команды:
		banish_quest_bot
		attack_quest_bot

 */
import Base from './Base.js';
import location_store_config from '../stores/location.js';

export default class Location extends Base{
	getStoreConfig(){
		return location_store_config;
	}
}