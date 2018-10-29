import C from '../engine/c.js';

const store = {
	isDead(){
		return this.get('dead') == 1 || this.get('timed').hp[0] == 0;
	},
	getShape(type){
		var shape = C.refs.ref('user_shape|'+this.get('shape'));

		if(type){
			return shape[type];
		}else return shape;
	}
};

export default store;