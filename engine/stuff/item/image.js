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
        DateUtils = require("engine/utils/date"),
        Factory = require("engine/factory"),
        GlobalActions = require("engine/actions"),

    ImageStuff = React.createClass({
        mixins:[Mixin],
        overrideMixin:{
            getDecoratorsAfter:function(){
                var me = this,
                    config = me.props.config,
                    proto = me.props.proto,
                    elements = [];
                
                if(config.params.value > 1){
                    elements.push(React.createElement('div',{
                        className:'d-stuff-quantity-image',
                        key:config.params.name + String(Math.random()) + 'quantity'
                    },config.params.value));
                }
    
                if(proto.timer && config.item_params){
                    var add_time = config.item_params.add_time,
                        timestamp = DateUtils.getDate(proto.timer);
    
                    if(add_time > timestamp){
                        timestamp = add_time + timestamp*1000;
                    }
    
                    elements.push(React.createElement('div',{
                        className:'d-stuff-decorator-timer-image',
                        key:config.params.name + add_time + 'timer'
                    },Factory.print('timer',{
                        time:timestamp,
                        options:{
                            type:'short',
                            need_normalize:true
                        }
                    },{
                        expire:function(){
                            GlobalActions.event('expire_item',me,me.props.item);
                        }
                    })));
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
                'div',
                _.extend(this.getElementDefaults(),{
                    className:'d-stuff-imaged d-stuff-item',
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