import C from '../c.js';
import Manager from './proto.js';

const LockStore = C.createStore('lock',{});

LockStore.set({
	locked:true
});

class LockManager extends Manager{
	constructor(){
		super();
		
		this.type = 'lock';
		this.locked = false;

		C.lock = this.lock;
		C.unlock = this.unlock;
	}
	lock(opts){
		if(!opts){
			opts = {
				locked:true
			}
		}else{
			opts.locked = true;
		}

		if(!opts.full){
			opts.full = false;
		}

		LockStore.set(opts);
	}
	unlock(){
		LockStore.set({
			locked:false
		});
	}
};

export default LockManager;