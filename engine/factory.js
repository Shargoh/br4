/*global define
*/
define(function(require){
    'use strict';
    var _ = require("lodash"),
        C = require("C"),
        React = require("react"),
        Marker = require("components/island/marker"),
        Reflux = require("reflux"),
        GlobalActions = require("./actions"),
        
    prints = {},
    
    Print = function(Class,data,listeners){
        var me = this;
        
        Reflux.ListenerMethods.listenTo(GlobalActions.printEvent,function(event_name){
            _.each(listeners,function(fn,event){
                if(event_name == event){
                    var args = [],
                        l = arguments.length,
                        i;
                        
                    for(i = 1; i < l; i++){
                        args.push(arguments[i]);
                    }
                    
                    fn.apply(me,args);
                }
            });
        });
        
        me.Class = Class;
        me.data = data;
    },

    Factory = {
        getMapMarker:function(data,svg_container){
            if(svg_container){
                
            }else{
                return React.createElement(Marker, data);
            }
        },
        print:function(name,data,listeners){
            var Class = prints[name];
            
            if(!Class){
                return console.error('Принт не зарегистрирован',name);
            }
            
            var el = new Print(Class,data,listeners);
            
            return el.create();
        },
        registerPrints:function(config){
            for(var name in config){
                prints[name] = config[name];
            }
        }
    };
    
    Print.prototype = {
        create:function(){
            return this.el = React.createElement(this.Class,this.data);
        }
    };

    return Factory;
});