/*global define
*/
define(function(require){
    'use strict';
    var _ = require("lodash"),
        C = require("C"),
        React = require("react"),
        Mixin = require("engine/stuff/mixin"),
        RDOM = require("reactDom"),
        Dialog = require("dialog/description"),

    PrintStuff = React.createClass({
        mixins:[Mixin],
        componentWillMount:function(){
            this.dialog = Dialog;
        },
        render:function(){
            var config = this.props.config;
            
            return React.createElement(
                'span',
                _.extend(this.getElementDefaults(),{
                    className:'d-stuff-printed d-stuff-item'
                },config.props),
                React.createElement('span',{
                    className:'d-stuff-print',
                    style:{
                        backgroundImage:'url('+this.props.item.image.normal+')'
                    }
                },React.createElement('span',{className:'d-stuff-print-value'},config.params.value))
            );
        }
    });

    return PrintStuff;
});