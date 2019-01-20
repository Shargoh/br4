import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import GlobalActions, { LocationActions } from '../../engine/actions.js';
import styles from './css.js';
import { l_dot } from '../../constants/images.js';

class MenuButton extends RefluxComponent {
	render() {
		var text_style,
			index = this.props.index,
			dot;

		if(index == this.props.active){
			text_style = styles.menu_active_text;
		}else{
			text_style = styles.menu_text;
		}

		if(index < this.props.bcount - 1){
			dot = <Image style={styles.menu_dot} source={C.getImage(l_dot)} />;
		}

		return (
			<View style={styles.menu_button_box}>
				<TouchableOpacity 
					style={styles.menu_button} 
					onPress={() => {
						GlobalActions.event('toggle_menu',index,true);
					}}
					ref={'view'}
					onLayout={() => {
						if(!this.pageX){
							this.refs.view.measure((x, y, width, height, pageX, pageY) => {
								this.pageX = pageX;
								LocationActions.event('active_menu_layout',{
									x:pageX,
									width:width,
									index:index
								});
							});
						}
					}}
				>
					<Text style={text_style}>{this.props.title}</Text>
				</TouchableOpacity>
				{dot}
			</View>
    )
  }
}
  
export default MenuButton;