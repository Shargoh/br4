/**
 *  Cервис мобильной арены

	Команды:

 */
import Base from './Base.js';

export default class MobileArena extends Base{
	static isSingle(){
		return false;
	}
	static canShow(){
		return true;
	}
}