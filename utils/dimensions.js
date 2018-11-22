import { Dimensions } from 'react-native';

const card_width = 346,
	card_height = 468;

const Dims = {
	pixel(number){
		return this.height(this.eHeight/number);
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
	eWidth:2048,
	eHeight:2732,
	// оптимальный размер экрана для игры
	bWidth:720,
	bHeight:1280,
	itemSide(){
		return this.width(4);
	},
	cardSize(){
		var width = this.height(this.eHeight/346),
			height = width*card_height/card_width,
			my = (this.height(this.eHeight/(1577 - 66)) - width*5)/10;

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
		var sw = this.width(1),
			sh = this.height(1),
			margin = sh/18;//по высоте заходит 6 карт, 1/3*1/6 = 1/18

		if(sw/sh >= this.bWidth/this.bHeight){
			return margin;
		}else{
			let antimargin = sh - this.bHeight*sw/this.bWidth;

			return margin - antimargin;
		}
	}
}

export default Dims;