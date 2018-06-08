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
                    className:'d-stuff-printed-large d-stuff-bonus'
                },config.props),
                React.createElement('span',{
                    className:'d-stuff-print-large',
                    style:{
                        backgroundImage:'url('+this.props.item.image.normal+')'
                    }
                },React.createElement('span',{className:'d-stuff-print-large-value'},config.params.value))
            );
        }
    });

    return PrintStuff;
});