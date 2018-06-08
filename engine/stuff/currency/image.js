/*global define
*/
define(function(require){
    'use strict';
    var _ = require("lodash"),
        C = require("C"),
        React = require("react"),
        Mixin = require("engine/stuff/mixin"),
        CurrencyMixin = require("./mixin"),
        RDOM = require("reactDom"),
        Dialog = require("dialog/description"),

    ImageStuff = React.createClass({
        mixins:[Mixin],
        componentWillMount:function(){
            this.dialog = Dialog;

            for(var key in CurrencyMixin){
                this[key] = CurrencyMixin[key];
            }
        },
        render:function(){
            var config = this.props.config;
            
            return React.createElement(
                'div',
                _.extend(this.getElementDefaults(),{
                    className:'d-stuff-imaged d-stuff-item'
                },config.props),
                this.getDecoratorsBefore('image'),
                React.createElement('div',{
                    className:'d-stuff-image',
                    style:{
                        backgroundImage:'url('+this.props.item.image.big+')'
                    }
                }),
                this.getDecoratorsAfter('image')
            );
        }
    });

    return ImageStuff;
});