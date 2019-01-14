import React from 'react';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { LocationActions } from '../../engine/actions.js';
import C from '../../engine/c.js';
import styles from './css';
import { l_arena_button, l_arena_data_bg, l_arena_timer_icon } from '../../constants/images.js';
import Timer from '../common/Timer.js';
import { LinearTextGradient } from 'react-native-text-gradient';

class ArenaPreview extends RefluxComponent {
	render(){
		var data = this.props.data;

		return (
			<View style={styles.swiper_container}>
				<View style={styles.arena_preview_container}>
					<Image source={data.img} style={styles.arena_preview_bg} />
					<TouchableOpacity style={[styles.arena_button,styles.arena_button_box]} onPress={() => {
						console.log('FIGHT!');
					}}>
						<Image source={C.getImage(l_arena_button)} style={styles.arena_button} />
					</TouchableOpacity>
					<View style={styles.arena_data_box}>
						<Image source={C.getImage(l_arena_data_bg)} style={styles.arena_data_bg} />
						<Image source={C.getImage(l_arena_timer_icon)} style={styles.arena_timer_icon} />
						<Timer textStyle={styles.arena_timer_text} time={data.left} options={{
							type:'long'
						}} />
						<Text style={styles.arena_division_shadow}>{data.num}</Text>
						<LinearTextGradient
							style={styles.arena_division_text}
							//#ffffff #a6b8c3 #c8d6de #647681;
							locations={[0,0.33,0.8]}
							colors={['#fffb75','#a6b8c3','#c8d6de']}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
						>
							{data.num}
						</LinearTextGradient>
						<LinearTextGradient
							style={styles.arena_league_text}
							//#fffb75 #cfab4b #fffc76 #946326
							locations={[0,0.33,1]}
							colors={['#fffb75','#cfab4b','#fffc76']}
							start={{ x: 0, y: 0 }}
							end={{ x: 0, y: 1 }}
						>
							{data.title}
						</LinearTextGradient>
						<Text style={styles.arena_flag_shadow}>{data.place}</Text>
						<LinearTextGradient
							style={styles.arena_flag_text}
							//#ffffff #fdf9bf
							locations={[0,1]}
							colors={['#ffffff','#fdf9bf']}
							start={{ x: 0, y: 0 }}
							end={{ x: 0, y: 1 }}
						>
							{data.place}
						</LinearTextGradient>
					</View>
				</View>
			</View>
		)
	}
}

export default ArenaPreview;