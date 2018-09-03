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
	}
}

export default Dims;