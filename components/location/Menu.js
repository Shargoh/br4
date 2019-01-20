import React from 'react';
import C from '../../engine/c.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { ImageBackground, Animated } from 'react-native';
import styles from './css.js';
import { l_footer } from '../../constants/images.js';
import MenuButton from './MenuButton.js';
import Dims from '../../utils/dimensions.js';

class Menu extends RefluxComponent {
	componentWillMount(){
		this.bindService('location');

		this.setState({
			anim:{
				left:new Animated.Value(0)
			}
		});
	}
	onAction(action,data){
		if(action == 'active_menu_layout'){
			Animated.timing(this.state.anim.left,{
				toValue:Dims.width(2) + Dims.pixel(30) - data.x - data.width/2,
				duration:200
			}).start();
		}
	}
	render() {
		var count = this.props.menus.length;

		return (
			<ImageBackground style={styles.footer} source={C.getImage(l_footer)}>
				<Animated.View style={[styles.footer,{
					left:this.state.anim.left
				}]}>
					{this.props.menus.map((el,index) => {
						var ref_name = 'menu'+index;

						return (
							<MenuButton 
								ref={ref_name}
								title={el.title} 
								bcount={count} 
								index={index} 
								active={this.props.active_menu} 
								key={ref_name} 
							/>
						)
					})}
				</Animated.View>
			</ImageBackground>
    )
  }
}
  
export default Menu;