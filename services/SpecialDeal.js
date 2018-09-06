/**
 *  Cервис набеганий

	Команды:
		banish_bot
		battle_bot_surging

 */
import Base from './Base.js';
import DateUtils from '../engine/utils/date.js';

export default class SpecialDeal extends Base{
	static isSingle(){
		return true;
	}
	getStoreConfig(){
		return {
			beforeSet(data){
				if(data.special_deal && DateUtils.serverTimeDif){
					data.special_deal.forEach((item) => {
						if(typeof item.ended == 'string'){
							item.ended = DateUtils.jsCoreDateCreator(item.ended).getTime();
							item.ended = DateUtils.normalizeDate(item.ended);
						}
					});
				}
			},
			updateTimers(){
				this.set({
					special_deal:this.get('special_deal')
				});
			}
		}
	}
}