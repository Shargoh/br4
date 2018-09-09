/*global define
*/
define(function(require){
    'use strict';
    var _ = require("lodash"),
        C = require("C"),
        React = require("react"),
        Mixin = require("engine/stuff/mixin"),
        RDOM = require("reactDom"),
        Dialog = require("dialog/item"),

    ImageStuff = React.createClass({
        mixins:[Mixin],
        overrideMixin:{
            getDecoratorsAfter:function(){
                var me = this,
                    config = me.props.config,
                    elements = [];
                
                if(config.params.value > 1){
                    elements.push(React.createElement('div',{
                        className:'d-stuff-item-quantity-large',
                        key:config.params.name + String(Math.random()) + 'quantity'
                    },config.params.value));
                }
                
                return elements;
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
        prepareButtons:function(apis){
            var me = this,
                config = me.props.config;
            
            return _.map(apis,function(api){
                return {
                    text:api.title,
                    confirm:api.confirm,
                    key:api.name,
                    type:'dl',
                    attrs:{
                        id:api.name + '_apibtn'
                    },
                    handler:function(){
                        C.api((api.api || 'item')+':'+api.name,_.extend({
                            marker_id:C.getStore('userStore').attributes.id,
                            object_id:config.params.name
                        },config.request_params)).then(function(data){
                            RDOM.unmountComponentAtNode(document.getElementById('wrap-item-dialog'));
                        });
                    }
                };
            });
        },
        render:function(){
            var me = this,
                config = this.props.config;
            
            return React.createElement(
                'span',
                _.extend(this.getElementDefaults(),{
                    className:'d-stuff-printed-large d-stuff-item',
                    onClick:function(e,id){
                        C.closeTooltips();
                        
                        if(config.request_api){
                            C.api('map:getDialog',_.extend({
                                object_id:config.params.name,
                                user_id:C.getStore('userStore').attributes.id
                            },config.request_params)).then(function(data){
                                me.buttons = me.prepareButtons(data.dialog.api);
                                me.details(e,id);
                            });
                        }else{
                            me.details(e,id);
                        }
                    }
                },config.props),
                this.getDecoratorsBefore(),
                React.createElement('span',{
                    className:'d-stuff-print-large',
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