import { Dimensions } from 'react-native';

const Dims = {
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
	itemSide(){
		return this.width(4);
	},
	cardSize(){
		var marginX = Dims.widthPercent(2),
			marginY = Dims.heightPercent(2),
			sw = this.width(1),
			sh = this.height(1),
			width, height;

		if(sw*8 > sh*5){
			// значит экран скорее широкий. За основу берем высоту экрана
			height = (sh/6 - 2*marginY);
			width = height*3/4;
		}else{
			width = (sw/5 - 2*marginX);
			height = width*4/3;
		}

		return {
			w:width,
			h:height,
			mx:marginX,
			my:marginY
		};
	}
}

export default Dims;