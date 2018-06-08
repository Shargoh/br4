define(function(require){
    'use strict';
    var _ = require("lodash"),
        Proto = require("../proto"),
        React = require("react"),
        C = require("C"),
        Dialog = require("dialog/description"),
        RDOM = require("reactDom"),
        Image = require("./image"),
        Print = require("./print"),
        PrintLarge = require("./print_large"),
    
    Ability = function(config){
        Array.prototype.push.call(arguments,config);
        Proto.apply(this,arguments);
        
        this.proto = C.getManager('stuff').abilities[config.params.name];
        this.item = _.extend({},this.proto,config.item_params);
        this.config = config;
    };

    Ability.prototype = _.extend(Object.create(Proto.prototype),{
        constructor:Ability,
        dialog:Dialog,
        print:function(config){
            return React.createElement(Print,{
                config:this.config,
                proto:this.proto,
                item:this.item,
                key:Math.random().toString()
            });
        },
        image:function(config){
            return React.createElement(Image,{
                config:this.config,
                proto:this.proto,
                item:this.item,
                key:Math.random().toString()
            });
        },
        printLarge:function(config){
            return React.createElement(PrintLarge,{
                config:this.config,
                proto:this.proto,
                item:this.item,
                key:Math.random().toString()
            });
        }
    });

    return Ability;
});
