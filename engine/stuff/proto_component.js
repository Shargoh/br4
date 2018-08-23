import React from 'react';

class StuffComponent extends React.Component {
	getDecorators(){
		var before = [],
			after = [];

		this.decorators.forEach((name) => {
			switch(name){

			}
		})

		return [before,after];
	}
	createWindow(is_tooltip){
		// return React.createElement(this.dialog,{
		// 	item:this.props.item,
		// 	user:this.props.config.user,
		// 	element:this,
		// 	is_tooltip:is_tooltip,
		// 	buttons:this.buttons
		// });
	}
}

export default StuffComponent;