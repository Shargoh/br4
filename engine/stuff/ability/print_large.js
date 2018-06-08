/*global define
*/
define(function(require){
    'use strict';
    var _ = require("lodash"),
        C = require("C"),
        React = require("react"),
        Mixin = require("engine/stuff/mixin"),
        RDOM = require("reactDom"),
        Dialog = require("dialog/ability"),
        AbilityMixin = require("./mixin"),

    ImageStuff = React.createClass({
        mixins:[Mixin,AbilityMixin],
        overrideMixin:{
            getDecoratorsAfter:function(){
                var decorators = this.props.config.decorators,
                    decorator,
                    push = Array.prototype.push;
    
                if(!decorators){
                    decorators = [];
                }
                
                decorators = decorators.concat(['charges','cooldown','stack','timer','level']);
                
                var i = decorators.length,
                    elements = [];
    
                while(i--){
                    switch(decorators[i]){
                        case 'steps': decorator = this.getStepsDecorator('large'); break;
                        case 'charges': decorator = this.getChargesDecorator('large'); break;
                        case 'timer': decorator = this.getTimerDecorator('large'); break;
                        case 'cooldown': decorator = this.getCooldownDecorator('large'); break;
                        case 'stack': decorator = this.getStackDecorator('large'); break;
                        case 'cost': decorator = this.getCostDecorator('large'); break;
                        case 'level': decorator = this.getLevelDecorator('large'); break;
                    }
                    
                    if(decorator && decorator.length){
                        push.apply(elements,decorator);
                    }else if(decorator){
                        elements.push(decorator);
                    }
                }
                
                if(elements.length){
                    return elements;
                }
            }
        },
        componentWillMount:function(){
            this.dialog = Dialog;
            
            if(this.overrideMixin){
                for(var key in this.overrideMixin){
                    this[key] = this.overrideMixin[key];
                }
            }
        },
        render:function(){
            var config = this.props.config,
                user = config.user || C.getStore('userStore'),
                images = this.props.item.images,
                img = images[user.get('fraction')] || images.ai || images.blue;
            
            return React.createElement(
                'div',
                _.extend(this.getElementDefaults(),{
                    className:'d-stuff-printed-large d-stuff-ability'
                },config.props),
                this.getDecoratorsBefore(),
                React.createElement('div',{
                    className:'d-stuff-print-large',
                    style:{
                        backgroundImage:'url('+img+')'
                    }
                }),
                this.getDecoratorsAfter()
            );
        }
    });

    return ImageStuff;
});