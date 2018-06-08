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
    
    Bonus = function(config){
        Array.prototype.push.call(arguments,config);
        Proto.apply(this,arguments);
        
        if(config.params.name == 'hp'){
            config.params.name = 'health';
        }
        
        this.proto = C.config.descriptions.bonus[config.params.name];
        this.item = _.extend({},this.proto,config.item_params);
        this.config = config;
    };

    Bonus.prototype = _.extend(Object.create(Proto.prototype),{
        constructor: Bonus,
        dialog: Dialog,
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

    return  Bonus;
});
