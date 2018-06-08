define(function(require){
    'use strict';
    var React = require("react");
    
    return {
        getDecoratorsAfter:function(type){
            var me = this,
                config = me.props.config;

            return React.createElement('div',{
                className:'d-stuff-quantity-'+type,
                key:config.params.name + 'quantity'
            },config.params.value);
        }
    };
});