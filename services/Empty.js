/**
 *  Cервис пустоты

	Команды: нет
 */
import Base from './Base.js';

export default class Empty extends Base{
	static isSingle(){
		return false;
	}
}