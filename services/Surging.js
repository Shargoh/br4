/**
 *  Cервис набеганий

	Команды:
		banish_bot
		battle_bot_surging

 */
import Base from './Base.js';

export default class Surging extends Base{
	static isSingle(){
		return false;
	}
}