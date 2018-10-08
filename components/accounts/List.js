import React from 'react';
import CSS from '../../css/main.js';
import RefluxComponent from '../../engine/views/reflux_component.js';
import { FlatList, Text, View, TouchableOpacity, Animated } from 'react-native';
import GlobalActions from '../../engine/actions.js';
import ListItem from './ListItem';
import { IS_TEST, TEST_ANIM } from '../../constants/common.js';
import styles, { card_size } from '../battle/css';

class AccountList extends RefluxComponent {
	componentWillMount(){
		this.bindStore('Accounts');
		this.setState(this.store.attributes);

		if(IS_TEST && TEST_ANIM){
			this.setState({
				anim:{
					left:new Animated.Value(50),
					top:new Animated.Value(0),
					width:new Animated.Value(card_size.w),
					rotate: new Animated.Value(0)
				},
				flipped:false
			})
		}
	}
	runTestAnimation(){
		Animated.sequence([
			Animated.parallel([
				Animated.timing(this.state.anim.left,{
					toValue:150,
					duration:1000
				}),
				Animated.timing(this.state.anim.top,{
					toValue:-50,
					duration:1000
				}),
				Animated.sequence([
					Animated.timing(this.state.anim.rotate,{
						toValue: 1,
						duration: 500
					}),
					Animated.timing(this.state.anim.rotate,{
						toValue: 0,
						duration: 500
					})
				])
			]),
			Animated.parallel([
				Animated.timing(this.state.anim.left,{
					toValue:200,
					duration:1000,
					delay:1000
				}),
				Animated.timing(this.state.anim.top,{
					toValue:-100,
					duration:1000,
					delay:1000
				})
			])
		]).start();

		setTimeout(() => {
			this.setState({
				flipped:true
			})
		},500);
	}
  render() {
		var animation_test;

		if(IS_TEST && TEST_ANIM){
			let inside;

			if(this.state.flipped){
				inside = (
					<Text>Value</Text>
				)
			}else{
				inside = (
					<Text>Card</Text>
				)
			}

			animation_test = (
				<View>
					<Animated.View ref={'turn'} style={[styles.card,{
						backgroundColor:'lime',
						left:this.state.anim.left,
						top:this.state.anim.top,
						width:this.state.anim.width,
						transform:[{
							// rotateY: this.state.anim.rotate.interpolate({
							// 	inputRange: [0, 1],
							// 	outputRange: [ '0deg', '180deg' ]
							// })
							scaleX: this.state.anim.rotate.interpolate({
								inputRange: [0, 1],
								outputRange: [ 1, 0 ]
							})
						},{perspective: 1000}]
					}]}>
						{inside}
					</Animated.View>
					<TouchableOpacity style={CSS.bottom_button} onPress={() => {
						this.runTestAnimation();
					}}>
						<Text style={CSS.bottom_button_text}>
							Animation!
						</Text>
					</TouchableOpacity>
				</View>
			)
		}
		
		return (
			<View style={{
				flex:1,
				width:'100%',
			}}>
				<FlatList
					style={{
						marginTop:70
					}}
					data={this.state.accounts}
					renderItem={({item}) => (
						<ListItem item={item} />
					)}
					keyExtractor={(item, index) => 'account'+index}
				/>
				{animation_test}
				<TouchableOpacity style={CSS.bottom_button} onPress={() => {
					GlobalActions.state(1);
				}}>
					<Text style={CSS.bottom_button_text}>
						Добавить аккаунт
					</Text>
				</TouchableOpacity>
			</View>
    )
  }
}
  
export default AccountList;