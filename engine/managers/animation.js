import C from '../c.js';
import Manager from './proto.js';

const RUN = 'RUN';

class AnimationData{
	constructor(data,name){
		this.name = name;
		this.height = data.frames[0][0];
		this.width = data.frames[0][2];
		this.frames_count = data.frames[0][1];
		this.image = C.images[data.images[0]];

		this.config = {
			name:name,
			size:{
				width:this.width,
				height:this.height
			},
			animationTypes:[RUN],
			frames:[this.image],
			animationIndex:function getAnimationIndex(animationType){
				return
			}
		}

		const monsterSprite = {
			name:"monster",
			size: {width: 220, height: 220},
			animationTypes: ['RUN'],
			frames: [
				require('./monster_idle.png'),
				require('./monster_walk01.png'),
				require('./monster_walk02.png'),
				require('./monster_walk03.png'),
				require('./monster_eat01.png'),
				require('./monster_eat02.png'),
				require('./monster_celebrate01.png'),
				require('./monster_celebrate02.png'),
				require('./monster_disgust01.png'),
			],
			animationIndex: function getAnimationIndex (animationType) {
				switch (animationType) {
					case 'IDLE':
						return [0];
					case 'WALK':
						return [1,2,3,0];
					case 'EAT':
						return [4,5,4,0];
					case 'CELEBRATE':
						return [6,7,6,0,6,7,6,0];
					case 'DISGUST':
						return [0,8,8,8,8,0];
					case 'ALL':
						return [0,1,2,3,4,5,6,7,8];
				}
			},
		};
	}
}

class LockManager extends Manager{
	constructor(){
		super();
		
		this.type = 'animation';
		this.animations = {};

		Reflux.ListenerMethods.listenTo(GlobalActions.initAnimations,() => {
			this.initialize();
		});
	}
	initialize(){
		var animations = C.refs.ref('battle_animations');

		for(let name in animations){
			this.animations[name] = new AnimationData(animations[name],name);
		}
	}
};

export default LockManager;