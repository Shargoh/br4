import { Dimensions } from 'react-native';

const card_width = 346,
	card_height = 468,
	H = Dimensions.get('window').height,
	W = Dimensions.get('window').width,
	bHeight = 1280,
	bWidth = 720,
	eHeight = 2732,
	eWidth = 2048,
	kWidth = eHeight*bWidth/bHeight;

var battle_margin_top,
	margin = H/18;//по высоте заходит 6 карт, 1/3*1/6 = 1/18

if(W/H >= bWidth/bHeight){
	battle_margin_top = margin;
}else{
	let antimargin = H - bHeight*W/bWidth;

	battle_margin_top = margin - antimargin;
}

const K = (H + battle_margin_top)/W - bHeight/bWidth;

const Dims = {
	pixel(number){
		if(K > 0){
			return this.width(kWidth/number);
		}else return this.height(eHeight/number);
	},
	widthPercent(percent){
		return Dimensions.get('window').width*percent/100;
	},
	heightPercent(percent){
		return Dimensions.get('window').height*percent/100;
	},
	width(k){
		return Dimensions.get('window').width/k;
	},
	height(k){
		return Dimensions.get('window').height/k;
	},
	// размер, под который рассчитана нарезка
	eWidth:eWidth,
	eHeight:eHeight,
	// оптимальный размер экрана для игры
	bWidth:bWidth,
	bHeight:bHeight,
	itemSide(){
		return this.width(4);
	},
	cardSize(){
		var width = this.pixel(346),
			height = width*card_height/card_width,
			my = (this.pixel(1577 - 66) - width*5)/10;

		return {
			w:width,
			h:height,
			my:my
		};
	},
	/**
	 * В бою весь экран будет чуть смещен вверх, ориентировочно на 1/3 высоты карты
	 * Если экран устройства слишком вытянут - это смещение уменьшается
	 */
	battleMarginTop(){
		var margin = H/18;//по высоте заходит 6 карт, 1/3*1/6 = 1/18

		if(W/H >= bWidth/bHeight){
			return margin;
		}else{
			let antimargin = H - bHeight*W/bWidth;

			return margin - antimargin*0.75;
		}
	}
}

export default Dims;