import React from 'react';
import { StyleSheet, PanResponder, Animated } from 'react-native';

const styles = StyleSheet.create({
	inside: {
		flex:1,
		justifyContent:'center',
	}
});

class ChangeItem extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };
  }
	componentWillMount(){
		// Add a listener for the delta value change
    this._val = {x:0, y:0}
    this.state.pan.addListener((value) => this._val = value);
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
			onMoveShouldSetPanResponder: (e, gesture) => {
				//return true if user is swiping, return false if it's a single click
				return !(gesture.dx === 0 && gesture.dy === 0);
			},
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: (e,gesture) => {
				this.onMove(e,gesture);

				Animated.event([null,{
					dx:this.state.pan.x,
					dy:this.state.pan.y
				}])(e,gesture);
			},
			onPanResponderGrant: (e,gesture) => {
        // this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value });
        this.state.pan.setValue({
					x:0,
					y:0
				});

				this.onStartDrag(e,gesture);

        // Animated.spring(this.state.scale, { toValue: 0.75, friction: 3 }).start();

        this.setState({
					view_anim_style:{
						zIndex:1
					}
				});
			},
			onPanResponderRelease: (e, gesture) => {
        if (this.isDropArea(gesture)) {
          this.animateCorrectDrop(e,gesture);
				} else {
					this.animateWrongDrop(e,gesture);
				}
			}
    });
	}
	animateCorrectDrop(e, gesture){
		Animated.timing(this.state.opacity, {
			toValue: 0,
			duration: 1000
		}).start(() => {
			this.onDrop(e,gesture,true);
		});
	}
	animateWrongDrop(e, gesture){
		Animated.spring(this.state.pan, {
			toValue: { x: 0, y: 0 },
			friction: 5
		}).start(() => {
			this.onDrop(e,gesture,false);
		});
	}
	onDrop(e,gesture,in_drop_area){}
	onStartDrag(e,gesture){}
	onMove(e,gesture){}
	isDropArea(gesture){
    return gesture.moveY < 200;
	}
	renderContent(){}
  render() {
		const pan_style = {
			transform: this.state.pan.getTranslateTransform()
		};

		const view_style = this.props.style || styles.inside;

		return (
			<Animated.View
				{...this.panResponder.panHandlers}
				style={[pan_style, view_style]}
			>
				{this.renderContent()}
			</Animated.View>
    )
  }
}
  
export default ChangeItem;