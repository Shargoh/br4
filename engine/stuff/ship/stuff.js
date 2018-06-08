define(function(require){
    'use strict';
    var _ = require("lodash"),
        Proto = require("../proto"),
        React = require("react"),
        C = require("C"),
        RDOM = require("reactDom"),
        Image = require("./image"),
        Print = require("./print"),
    
    Bonus = function(config){
        Array.prototype.push.call(arguments,config);
        Proto.apply(this,arguments);

        this.proto = C.config.prototypes.ships[config.params.name];
        this.item = _.extend({},this.proto,config.params);
        this.config = config;
    };

    Bonus.prototype = _.extend(Object.create(Proto.prototype),{
        constructor: Bonus,
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
        }
    });

    return  Bonus;
});
