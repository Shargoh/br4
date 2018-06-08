define(function(require){
    'use strict';
    var Proto = function(config){
            this.config = config;
        },
        C = require("C"),
        RDOM = require("reactDom");
    
    Proto.prototype = {
        image:function(){},
        print:function(){},
        printLarge:function(){},
        title:function(){},
    };

    return  Proto;
});
