/**
 * Cервис перехода
 */
import Base from './Base.js';

export default class Room extends Base{
	static isSingle(){
		return false;
	}
}