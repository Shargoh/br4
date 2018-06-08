define(function(require){
    'use strict';
    var _ = require("lodash"),
        C = require("C"),
        React = require("react"),
        RDOM = require("reactDom"),
        Info = require("components/mixin/info");
    
    return _.extend({
        getDecoratorsBefore:function(){},
        getDecoratorsAfter:function(){},
        createWindow:function(is_tooltip){
            return React.createElement(this.dialog,{
                 item:this.props.item,
                 user:this.props.config.user,
                 element:this,
                 is_tooltip:is_tooltip,
                 buttons:this.buttons
            });
        }
    },Info);
});
