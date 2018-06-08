/*global define
*/
define(function(require){
    'use strict';
    var _ = require("lodash"),
        C = require("C"),
        React = require("react"),
        Mixin = require("engine/stuff/mixin"),
        RDOM = require("reactDom"),
        Dialog = require("dialog/ship"),

    ImageStuff = React.createClass({
        mixins:[Mixin],
        componentWillMount:function(){
            this.dialog = Dialog;
        },
        render:function(){
            var config = this.props.config;
            
            return React.createElement(
                'div',
                _.extend(this.getElementDefaults(),{
                    className:'d-stuff-imaged d-stuff-item'
                },config.props),
                this.getDecoratorsBefore(),
                React.createElement('div',{
                    className:'d-stuff-image',
                    style:{
                        backgroundImage:'url('+this.props.item.image.normal+')'
                    }
                }),
                this.getDecoratorsAfter()
            );
        }
    });

    return ImageStuff;
});