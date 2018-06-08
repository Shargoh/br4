define(function(require){
    'use strict';
    var _ = require("lodash"),
        Proto = require("../proto"),
        React = require("react"),
        C = require("C"),
        Image = require("./image"),
        PrintLarge = require("./print_large"),
        Print = require("./print"),
    
    Item = function(config){
        Array.prototype.push.call(arguments,config);
        Proto.apply(this,arguments);
        
        this.proto = C.config.prototypes.items[config.params.name];
        this.item = _.extend({},this.proto,config.item_params);
        this.config = config;
    };

    Item.prototype = _.extend(Object.create(Proto.prototype),{
        constructor: Item,
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

    return  Item;
});
